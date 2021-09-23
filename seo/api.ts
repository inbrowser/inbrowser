const superagent = require('superagent')
const cheerio = require('cheerio')

/**
 * Crawl the URL root, return the URL crawled.
 * @param already_crawled if the URL is inside already_created, we are skipping it
 * @param root the URL to crawl
 * @param origin the origin of the request, make sure that we are not crawling another website
 * @param last if true, do not add new URLs
 * @return Array array[0] = next URLs to crawl, array[1] = errors
 */
async function crawlPage(already_crawled: Array<string>, root: string,
                         origin: string, last: boolean ) : Promise<Array<Array<string>>> {
    let newLinks : Array<string> = [];
    let deadLinks : Array<string> = [];
    await new Promise((resolve,reject) => {
        // get page
        superagent.get(root)
            .set('User-Agent', 'googlebot')
            .end((err: string, resource: any) => {
            if (err) reject(err);
            else resolve(resource);
        })
    }).then((r:any) => {
        // do not switch website
        if (last || !root.startsWith(origin)) return;
        // parse links
        let $ = cheerio.load(r.text);
        $('a').each((i: any, el: any) => {
            let href : string = $(el).attr('href');
            if (!href.startsWith("mailto") && // not a mail, and not already planned
                already_crawled.indexOf("href") == -1 && newLinks.indexOf("href") == -1) {
                if (!href.startsWith("http")) {
                    href = root + href;
                }
                newLinks.push(href);
            }
        })
    }).catch(() => {
        deadLinks.push(root)
    });
    return [newLinks, deadLinks];
}

/**
 * @param URL Take a URL, crawl the website.
 * @param max_depth stop crawling after (up to 5)
 * @return list of crawled pages which are dead links
 */
export async function CrawlWebsiteFor404(URL: string, max_depth: number = 10) : Promise<null | Array<string>> {
    let todo : Array<string> = [];
    let otherTodo : Array<string> = [URL];
    let done : Array<string> = [];
    let errors : Array<string> = [];

    do {
        // take and clear
        todo.push(... otherTodo)
        otherTodo = [];

        for(let t of todo) {
            if (done.indexOf(t) != -1) continue;
            let r = await crawlPage(done, t, URL, max_depth - 1 == 0);
            // add at the end
            done.push(t)
            otherTodo = otherTodo.concat(r[0])
            errors = errors.concat(r[1])

            await new Promise(resolve => setTimeout(() => resolve(null), 10));
        }
        max_depth--;
    } while (max_depth > 0 && otherTodo != []);
    return errors;
}