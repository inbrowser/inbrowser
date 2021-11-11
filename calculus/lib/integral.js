"use strict";
exports.__esModule = true;
exports.createIntegral = void 0;
var mathjs_1 = require("mathjs");
exports.createIntegral = (0, mathjs_1.factory)('integrate', ['parse', 'simplify', 'typed', 'ConstantNode', 'FunctionNode', 'OperatorNode', 'SymbolNode'], function (_a) {
    var parse = _a.parse, simplify = _a.simplify, typed = _a.typed, ConstantNode = _a.ConstantNode, FunctionNode = _a.FunctionNode, OperatorNode = _a.OperatorNode, SymbolNode = _a.SymbolNode;
    var simplifyConstant = simplify;
    var integral = typed('integral', {
        'Node, SymbolNode, Object': function (expr, variable, options) {
            if (options.simplify === undefined)
                options.simplify = true;
            if (options.debugPrint === undefined)
                options.debugPrint = false;
            if (options.rules === undefined)
                options.rules = integral.rules;
            var context = new IntegrationContext(variable, options);
            var simplifiedExpr = preprocessIntegrand(expr, context);
            var integralResult = _integral(simplifiedExpr, context);
            if (!integralResult) {
                throw new Error('Unable to find integral of "' + expr + '" with respect to "' + variable + '"');
            }
            integralResult = integralResult.cloneDeep();
            return options.simplify === true ? simplify(integralResult) : integralResult;
        },
        'Node, SymbolNode': function (expr, variable) {
            return integral(expr, variable, {});
        },
        'string, SymbolNode, Object': function (expr, variable, options) {
            return integral(parse(expr), variable, options);
        },
        'string, SymbolNode': function (expr, variable) {
            return integral(parse(expr), variable);
        },
        'Node, string, Object': function (expr, variable, options) {
            return integral(expr, parse(variable), options);
        },
        'Node, string': function (expr, variable) {
            return integral(expr, parse(variable));
        },
        'string, string, Object': function (expr, variable, options) {
            return integral(parse(expr), parse(variable), options);
        },
        'string, string': function (expr, variable) {
            return integral(parse(expr), parse(variable));
        }
    });
    function IntegrationContext(variable, options) {
        this.variable = variable.clone();
        this.options = options;
        this._constantExpr = {};
        this.subIntegral = {};
        this.rules = options.rules;
        this.debugIndent = 0;
    }
    IntegrationContext.prototype.isConstant = function (expr) {
        if (typeof this._constantExpr[expr] === 'boolean') {
            return this._constantExpr[expr];
        }
        else {
            return (this._constantExpr[expr] = isConstantHelper(expr, this));
        }
        function isConstantHelper(expr, self) {
            switch (expr.type) {
                case "ConstantNode":
                    return true;
                case "SymbolNode":
                    return expr.name !== self.variable.name;
                case "OperatorNode":
                    return expr.args.every(self.isConstant.bind(self));
                case "ParenthesisNode":
                    return self.isConstant(expr.content);
                case "FunctionNode":
                    return expr.args.every(self.isConstant.bind(self));
                default:
                    throw new Error("Node type '" + expr.type + "' is currently unsupported in isConstant.");
            }
        }
    };
    IntegrationContext.prototype.printDebug = function (text) {
        if (this.options.debugPrint) {
            var indent = "";
            for (var i = 0; i < this.debugIndent; i++) {
                indent += "  ";
            }
            console.log(indent + text);
        }
    };
    function preprocessIntegrand(expr, context) {
        expr = removeParenthesis(expr);
        expr = reduceFunctions(expr);
        expr = removeDivision(expr);
        return expr;
        function removeParenthesis(node) {
            if (node.type === "ParenthesisNode") {
                return removeParenthesis(node.content);
            }
            else {
                return node.map(removeParenthesis);
            }
        }
        function reduceFunctions(expr) {
            return helper(expr);
            function helper(expr) {
                if (!context.isConstant(expr) && expr.type === "FunctionNode") {
                    var funcName = typeof expr.fn === "string" ? expr.fn : expr.fn.name;
                    switch (funcName) {
                        case "add":
                            return new OperatorNode('+', 'add', expr.args);
                        case "subtract":
                            return new OperatorNode('-', 'subtract', expr.args);
                        case "multiply":
                            return new OperatorNode('*', 'multiply', expr.args);
                        case "divide":
                            return new OperatorNode('/', 'divide', expr.args);
                        case "sqrt":
                            return new OperatorNode('^', 'pow', [
                                expr.args[0].map(helper),
                                new OperatorNode('/', 'divide', [
                                    new ConstantNode(1),
                                    new ConstantNode(2)
                                ])
                            ]);
                        case "nthRoot":
                            return new OperatorNode('^', 'pow', [
                                expr.args[0].map(helper),
                                new OperatorNode('/', 'divide', [
                                    new ConstantNode(1),
                                    expr.args[1].map(helper)
                                ])
                            ]);
                        case "exp":
                            return new OperatorNode('^', 'pow', [new SymbolNode('e'), expr.args[0]]);
                        case "pow":
                            return new OperatorNode('^', 'pow', expr.args);
                        case "log":
                            if (expr.args.length === 2) {
                                return new OperatorNode('/', 'divide', [
                                    new FunctionNode('log', [expr.args[0].map(helper)]),
                                    new FunctionNode('log', [expr.args[1].map(helper)])
                                ]);
                            }
                            else {
                                break;
                            }
                        default:
                            break;
                    }
                }
                return expr.map(helper);
            }
        }
        function removeDivision(expr) {
            return expr.transform(function (node) {
                if (!context.isConstant(node) && node.type === 'OperatorNode' && node.op === '/') {
                    return new OperatorNode('*', 'multiply', [
                        node.args[0],
                        new OperatorNode('^', 'pow', [
                            node.args[1],
                            new ConstantNode(-1)
                        ])
                    ]);
                }
                else {
                    return node;
                }
            });
        }
    }
    function getNumericValue(expr) {
        var simplified = simplifyConstant(expr);
        return toNumber(simplified);
        function toNumber(expr) {
            if (expr.type === 'OperatorNode' && expr.op === '-' && expr.args.length === 1) {
                var num = toNumber(expr.args[0]);
                return num === undefined ? undefined : -num;
            }
            else if (expr.type === 'ConstantNode' && (!expr.valueType || expr.valueType === 'number')) {
                return +expr.value;
            }
            else {
                return undefined;
            }
        }
    }
    integral.rules = [
        function (expr, context, subIntegral) {
            var simplified = simplify.simplifyCore(expr, context);
            if (!simplified.equals(expr)) {
                return subIntegral(simplified, context, "simplified expression");
            }
        },
        function (expr, context, subIntegral) {
            if (expr.type === 'ParenthesisNode') {
                var int = subIntegral(expr.content, context, "parentheses removal");
                return int ? new ParenthesisNode(int) : null;
            }
        },
        function (expr, context) {
            if (context.isConstant(expr)) {
                return new OperatorNode('*', 'multiply', [
                    expr.clone(),
                    context.variable.clone()
                ]);
            }
        },
        function (expr, context, subIntegral) {
            if (expr.type === "OperatorNode" && (expr.op === '+' || expr.op === '-')) {
                var childInts = expr.args.map(function (expr) {
                    return subIntegral(expr, context, "sum rule");
                });
                if (childInts.every(function (n) { return n; })) {
                    return new OperatorNode(expr.op, expr.fn, childInts);
                }
            }
        },
        function (expr, context, subIntegral) {
            if (expr.type === "OperatorNode" && expr.op === "*") {
                var factors = getFactors(expr);
                if (factors.length > expr.args.length) {
                    return subIntegral(new OperatorNode('*', 'multiply', factors), context, "product flattening");
                }
            }
            function getFactors(expr) {
                if (expr.type === "OperatorNode" && expr.op === "*") {
                    return expr.args.reduce(function (factors, expr) {
                        return factors.concat(getFactors(expr));
                    }, []);
                }
                else if (expr.type === "ParenthesisNode") {
                    return getFactors(expr.content);
                }
                else {
                    return [expr];
                }
            }
        },
        function (expr, context) {
            if (expr.type === "SymbolNode" && expr.name === context.variable.name) {
                return new OperatorNode('*', 'multiply', [
                    new OperatorNode('/', 'divide', [
                        new ConstantNode(1),
                        new ConstantNode(2)
                    ]),
                    new OperatorNode('^', 'pow', [
                        expr.clone(),
                        new ConstantNode(2)
                    ])
                ]);
            }
        },
        function (expr, context, subIntegral) {
            if (expr.type === "OperatorNode" && expr.op === '*') {
                var constantFactors = [];
                var nonConstantFactors = [];
                expr.args.forEach(function (expr) {
                    if (context.isConstant(expr)) {
                        constantFactors.push(expr);
                    }
                    else {
                        nonConstantFactors.push(expr);
                    }
                });
                if (constantFactors.length !== 0) {
                    var constantNode = factorsToNode(constantFactors);
                    var nonConstantNode = factorsToNode(nonConstantFactors);
                    var nonConstantIntegral = subIntegral(nonConstantNode, context, "multiplication by constant");
                    if (nonConstantIntegral) {
                        return new OperatorNode('*', 'multiply', [constantNode, nonConstantIntegral]);
                    }
                }
                function factorsToNode(factors) {
                    if (factors.length === 1) {
                        return factors[0];
                    }
                    else {
                        return new OperatorNode('*', 'multiply', factors);
                    }
                }
            }
        },
        function (expr, context) {
            if (expr.type === "OperatorNode" && expr.op === '^' && expr.args[0].equals(context.variable) && context.isConstant(expr.args[1])) {
                var exponentValue = getNumericValue(expr.args[1]);
                if (exponentValue === -1) {
                    return new FunctionNode('log', [
                        new FunctionNode('abs', [
                            context.variable.clone()
                        ])
                    ]);
                }
                else {
                    return new OperatorNode('*', 'multiply', [
                        new OperatorNode('/', 'divide', [
                            new ConstantNode(1),
                            new OperatorNode('+', 'add', [
                                expr.args[1].clone(),
                                new ConstantNode(1)
                            ])
                        ]),
                        new OperatorNode('^', 'pow', [
                            expr.args[0].clone(),
                            new OperatorNode('+', 'add', [
                                expr.args[1].clone(),
                                new ConstantNode(1)
                            ])
                        ])
                    ]);
                }
            }
        },
        function (expr, context) {
            if (expr.type === 'OperatorNode' && expr.op === '^') {
                if (context.isConstant(expr.args[0]) && expr.args[1].equals(context.variable)) {
                    return new OperatorNode('/', 'divide', [
                        expr,
                        new FunctionNode('log', [expr.args[0]])
                    ]);
                }
            }
        },
        function (expr, context, subIntegral) {
            if (expr.type === "OperatorNode" && expr.op === '*') {
                var argsAsPower = expr.args.map(getExprInPowerForm);
                var reducedArgs = argsAsPower.reduce(function (acc, exprPower) {
                    for (var i = 0; i < acc.length; i++) {
                        if (acc[i].base.equals(exprPower.base)) {
                            acc[i].power = new OperatorNode('+', 'add', [
                                acc[i].power,
                                exprPower.power
                            ]);
                            return acc;
                        }
                    }
                    acc.push(exprPower);
                    return acc;
                }, []);
                if (reducedArgs.length < expr.args.length) {
                    var reducedExpr = powerFactorsToNode(reducedArgs);
                    return subIntegral(reducedExpr, context, "combining powers");
                }
            }
            function getExprInPowerForm(expr) {
                if (expr.type === "OperatorNode" && expr.op === '^') {
                    return {
                        base: expr.args[0],
                        power: expr.args[1]
                    };
                }
                else {
                    return {
                        base: expr,
                        power: new ConstantNode(1)
                    };
                }
            }
            function powerFactorsToNode(factors) {
                if (factors.length === 1) {
                    return powerToNode(factors[0]);
                }
                else {
                    return new OperatorNode('*', 'multiply', factors.map(powerToNode));
                }
                function powerToNode(powerExpr) {
                    return new OperatorNode('^', 'pow', [powerExpr.base, powerExpr.power]);
                }
            }
        },
        function (expr, context, subIntegral) {
            if (expr.type === 'OperatorNode' && expr.op === '^') {
                var base = expr.args[0];
                var exponent = expr.args[1];
                if (base.type === 'OperatorNode' && base.op === '*') {
                    return subIntegral(new OperatorNode('*', 'multiply', base.args.map(function (baseChild) {
                        return new OperatorNode('^', 'pow', [baseChild, exponent]);
                    })), context, "distributing power");
                }
            }
        },
        function (expr, context, subIntegral) {
            if (expr.type === 'OperatorNode' && expr.op === '^') {
                if (expr.args[0].type === 'OperatorNode' && expr.args[0].op === '^') {
                    return subIntegral(new OperatorNode('^', 'pow', [
                        expr.args[0].args[0],
                        new OperatorNode('*', 'multiply', [
                            expr.args[0].args[1],
                            expr.args[1]
                        ])
                    ]), context, 'removing double exponential');
                }
            }
        },
        function (expr, context, subIntegral) {
            if (expr.type === "OperatorNode" && expr.op === '*') {
                var wasChange = false;
                var isTotalPositive = true;
                var processedArgs = [];
                expr.args.forEach(function (expr) {
                    if (expr.type === "OperatorNode" && expr.args.length === 1 && (expr.op === '+' || expr.op === '-')) {
                        wasChange = true;
                        isTotalPositive = isTotalPositive ^ (expr.op === '-');
                        processedArgs.push(expr.args[0]);
                    }
                    else {
                        processedArgs.push(expr);
                    }
                });
                if (wasChange) {
                    var int = subIntegral(new OperatorNode('*', 'multiply', processedArgs), context, "removing unary +/- from factors");
                    if (int) {
                        return isTotalPositive ? int : new OperatorNode('-', 'unaryMinus', [int]);
                    }
                }
            }
        },
        function (expr, context, subIntegral) {
            if (expr.type === "OperatorNode" && expr.op === '*') {
                var sumNode = null;
                var otherFactors = null;
                for (var i = 0; i < expr.args.length; i++) {
                    if (expr.args[i].type === "OperatorNode" && (expr.args[i].op === '+' || expr.args[i].op === '-')) {
                        sumNode = expr.args[i];
                        otherFactors = expr.args.filter(function (expr, index) { return index !== i; });
                        break;
                    }
                }
                if (sumNode !== null) {
                    var newTerms = sumNode.args.map(function (term) {
                        return new OperatorNode('*', 'multiply', otherFactors.concat([term]));
                    });
                    return subIntegral(new OperatorNode(sumNode.op, sumNode.fn, newTerms), context, "product distribution");
                }
            }
        },
        function (expr, context, subIntegral) {
            var createIntegralWrapper = null;
            var uniqueParent = getParentOfUniqueVariable(expr);
            if (uniqueParent !== null && uniqueParent.type === "OperatorNode") {
                if (uniqueParent.op === '+' || uniqueParent.op === '-') {
                    if (uniqueParent.args.length === 1) {
                        createIntegralWrapper = function (int) {
                            return new OperatorNode(uniqueParent.op, uniqueParent.fn, [int]);
                        };
                    }
                    else {
                        createIntegralWrapper = function (int) {
                            return int;
                        };
                    }
                }
                else if (uniqueParent.op === '*') {
                    createIntegralWrapper = function (int) {
                        return new OperatorNode('/', 'divide', [int,
                            replaceNodeInTree(uniqueParent, context.variable, new ConstantNode(1))
                        ]);
                    };
                }
                if (createIntegralWrapper !== null) {
                    var preIntegral = replaceNodeInTree(expr, uniqueParent, context.variable.clone());
                    var int = subIntegral(preIntegral, context, "linear substitution");
                    if (int) {
                        var backSubstituted = replaceNodeInTree(int, context.variable, uniqueParent);
                        return createIntegralWrapper(backSubstituted);
                    }
                }
            }
            function replaceNodeInTree(expr, node, replacement) {
                return replaceHelper(expr);
                function replaceHelper(curNode) {
                    return node.equals(curNode) ? replacement : curNode.map(replaceHelper);
                }
            }
            function getParentOfUniqueVariable(expr) {
                return helper(expr, null);
                function helper(expr, parent) {
                    if (context.isConstant(expr)) {
                        return null;
                    }
                    else if (expr.type === "SymbolNode" && expr.name === context.variable.name) {
                        return parent;
                    }
                    else {
                        var nonConstantChildren = [];
                        expr.forEach(function (child) {
                            if (!context.isConstant(child)) {
                                nonConstantChildren.push(child);
                            }
                        });
                        if (nonConstantChildren.length === 1) {
                            return helper(nonConstantChildren[0], expr);
                        }
                        else {
                            return null;
                        }
                    }
                }
            }
        },
        function (expr, context, subIntegral) {
            var MaxExponentExpanded = 10;
            if (expr.type === 'OperatorNode' && expr.op === '^') {
                var multipliedOut = tryMultiplyOut(expr);
                if (multipliedOut) {
                    var int = subIntegral(multipliedOut, context, "reducing power");
                    if (int) {
                        return int;
                    }
                }
            }
            else if (expr.type === 'OperatorNode' && expr.op === '*') {
                for (var i = 0; i < expr.args.length; i++) {
                    var multipliedOutChild = tryMultiplyOut(expr.args[i]);
                    if (multipliedOutChild) {
                        var int = subIntegral(new OperatorNode('*', 'multiply', multipliedOutChild.args.concat(expr.args.slice(0, i), expr.args.slice(i + 1))), context, "reducing power");
                        if (int) {
                            return int;
                        }
                    }
                }
            }
            function tryMultiplyOut(expr) {
                if (expr.type === 'OperatorNode' && expr.op === '^' && !context.isConstant(expr.args[0])) {
                    var exponentValue = getNumericValue(expr.args[1]);
                    if (Number.isInteger(exponentValue) && exponentValue > 1 && exponentValue <= MaxExponentExpanded) {
                        return new OperatorNode('*', 'multiply', [
                            expr.args[0],
                            exponentValue === 2 ? expr.args[0] : new OperatorNode('^', 'pow', [
                                expr.args[0],
                                new ConstantNode(exponentValue - 1)
                            ])
                        ]);
                    }
                }
                return null;
            }
        },
        function (expr, context, subIntegral) {
            if (expr.type === 'FunctionNode' && expr.name === 'log' && expr.args.length === 1) {
                if (expr.args.length === 1 && expr.args[0].equals(context.variable)) {
                    return new OperatorNode('-', 'subtract', [
                        new OperatorNode('*', 'multiply', [
                            context.variable,
                            new FunctionNode('log', [context.variable])
                        ]),
                        context.variable
                    ]);
                }
            }
        },
        function (expr, context, subIntegral) {
            if (expr.type === 'FunctionNode' && expr.args[0].equals(context.variable)) {
                switch (expr.name) {
                    case "sin":
                        return new OperatorNode('-', 'unaryMinus', [
                            new FunctionNode("cos", [context.variable])
                        ]);
                    case "cos":
                        return new FunctionNode("sin", [context.variable]);
                    case "tan":
                        return new FunctionNode('log', [
                            new FunctionNode('abs', [
                                new FunctionNode('sec', [context.variable])
                            ])
                        ]);
                    case "sec":
                        return new FunctionNode('log', [
                            new FunctionNode('abs', [
                                new OperatorNode('+', 'add', [
                                    new FunctionNode('sec', [context.variable]),
                                    new FunctionNode('tan', [context.variable])
                                ])
                            ])
                        ]);
                    case "csc":
                        return new FunctionNode('log', [
                            new FunctionNode('abs', [
                                new OperatorNode('-', 'subtract', [
                                    new FunctionNode('csc', [context.variable]),
                                    new FunctionNode('cot', [context.variable])
                                ])
                            ])
                        ]);
                    case "cot":
                        return new FunctionNode('log', [
                            new FunctionNode('abs', [
                                new FunctionNode('sin', [context.variable])
                            ])
                        ]);
                    default:
                        return null;
                }
            }
        }
    ];
    function _integral(expr, context, lastRuleComment) {
        var exprString = expr.toString({
            parenthesis: 'all',
            handler: function (node, options) {
                if (node.type === 'ParenthesisNode') {
                    return '(' + node.content.toString(options) + ')';
                }
            }
        });
        var debugComment = lastRuleComment ? lastRuleComment + ": " : "";
        debugComment += "find integral of " + exprString + "  d" + context.variable.name;
        context.printDebug(debugComment);
        context.debugIndent++;
        if (context.subIntegral[exprString] !== undefined) {
            context.printDebug("Precomputed: " + context.subIntegral[exprString]);
            context.debugIndent--;
            return context.subIntegral[exprString];
        }
        context.subIntegral[exprString] = null;
        for (var i = 0; i < context.rules.length; i++) {
            var result = context.rules[i](expr, context, _integral);
            if (result !== undefined && result !== null) {
                context.subIntegral[exprString] = result;
                context.printDebug("Computed: " + result.toString({ parenthesis: 'all' }));
                context.debugIndent--;
                return result;
            }
        }
        context.printDebug("No integral found");
        context.debugIndent--;
        return null;
    }
    return integral;
});
//# sourceMappingURL=integral.js.map