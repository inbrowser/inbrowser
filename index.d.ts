/**
 * Basic format of a result of our API.
 */
export class APIResult {
    /**
     * An object, this may be redefined in inheriting classes.
     */
    public result: object | null;
    /**
     * If something wrong happened, we are setting result "null"
     * and we are adding an error message here.
     */
    public error?: string;
}