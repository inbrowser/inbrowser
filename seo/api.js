"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CrawlWebsiteFor404 = void 0;
var superagent = require('superagent');
var cheerio = require('cheerio');
var defaultCheerioOptions = {
    normalizeWhitespace: false,
    xmlMode: false,
    decodeEntities: true
};
function crawlPage(already_crawled, root, origin, last) {
    return __awaiter(this, void 0, void 0, function () {
        var newLinks, deadLinks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newLinks = [];
                    deadLinks = [];
                    return [4, new Promise(function (resolve, reject) {
                            superagent.get(root)
                                .set('User-Agent', 'googlebot')
                                .end(function (err, resource) {
                                if (err)
                                    reject(err);
                                else
                                    resolve(resource);
                            });
                        }).then(function (r) {
                            if (last || !root.startsWith(origin))
                                return;
                            var $ = cheerio.load(r.text, defaultCheerioOptions);
                            $('a').each(function (i, el) {
                                var href = $(el).attr('href');
                                if (!href.startsWith("mailto") &&
                                    already_crawled.indexOf("href") == -1 && newLinks.indexOf("href") == -1) {
                                    if (!href.startsWith("http")) {
                                        href = root + href;
                                    }
                                    newLinks.push(href);
                                }
                            });
                        })["catch"](function () {
                            deadLinks.push(root);
                        })];
                case 1:
                    _a.sent();
                    return [2, [newLinks, deadLinks]];
            }
        });
    });
}
function CrawlWebsiteFor404(URL, max_depth) {
    if (max_depth === void 0) { max_depth = 10; }
    return __awaiter(this, void 0, void 0, function () {
        var todo, otherTodo, done, errors, _i, todo_1, t, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    todo = [];
                    otherTodo = [URL];
                    done = [];
                    errors = [];
                    _a.label = 1;
                case 1:
                    todo.push.apply(todo, otherTodo);
                    otherTodo = [];
                    _i = 0, todo_1 = todo;
                    _a.label = 2;
                case 2:
                    if (!(_i < todo_1.length)) return [3, 6];
                    t = todo_1[_i];
                    if (done.indexOf(t) != -1)
                        return [3, 5];
                    return [4, crawlPage(done, t, URL, max_depth - 1 == 0)];
                case 3:
                    r = _a.sent();
                    done.push(t);
                    otherTodo = otherTodo.concat(r[0]);
                    errors = errors.concat(r[1]);
                    return [4, new Promise(function (resolve) { return setTimeout(function () { return resolve(null); }, 10); })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3, 2];
                case 6:
                    max_depth--;
                    _a.label = 7;
                case 7:
                    if (max_depth > 0 && otherTodo != []) return [3, 1];
                    _a.label = 8;
                case 8: return [2, errors];
            }
        });
    });
}
exports.CrawlWebsiteFor404 = CrawlWebsiteFor404;
//# sourceMappingURL=api.js.map