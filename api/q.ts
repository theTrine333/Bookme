import { SearchResult } from "@/types";
import * as cheerio from "react-native-cheerio";
import * as Constants from "expo-constants";
const mainUrl = Constants.default.expoConfig?.extra?.main_url;
const search_params =
  "&columns%5B%5D=t&columns%5B%5D=a&columns%5B%5D=s&columns%5B%5D=y&columns%5B%5D=p&columns%5B%5D=i&objects%5B%5D=f&objects%5B%5D=e&objects%5B%5D=s&objects%5B%5D=a&objects%5B%5D=p&objects%5B%5D=w&topics%5B%5D=l&topics%5B%5D=c&topics%5B%5D=f&topics%5B%5D=a&topics%5B%5D=m&topics%5B%5D=r&topics%5B%5D=s&res=100&covers=on&showch=on&gmode=on&filesuns=all&";

export async function getSearch(
  q: string,
  page: number = 1
): Promise<{ status: number; results: SearchResult[] }> {
  const query = q.toLowerCase().trim().replace(/ /g, "+");
  const searchUrl = `index.php?req=${query}${search_params}page=${page}`;
  let response: Response | undefined;
  let uniqueBooks = new Set();
  try {
    response = await fetch(mainUrl + searchUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    const rows = $("table.table.table-striped tbody").find("tr");
    const searchResults: any[] = [];
    rows.each((_: any, row: any) => {
      const tds = $(row).find("td");
      //   if (tds.length < 9) return;
      try {
        const Url = $(row).find("a").attr("href");
        const tempPoster = $(row).find("a img").attr("src");
        const Poster = tempPoster ? `https://libgen.li${tempPoster}` : "";
        const bookName = $(row).find("td").eq(1).find("a").text().trim();
        const bookAuthers = $(row).find("td").eq(2).text().trim();
        const yearOfPub = $(row).find("td").eq(4).text().trim();
        const language = $(row).find("td").eq(5).text().trim();
        const downloadSize = $(row).find("td").eq(7).text().trim();
        const fileType = $(row).find("td").eq(8).text().trim();
        const server1 = `${$(row)
          .find("td")
          .eq(9)
          .find("a")
          .eq(0)
          .attr("href")}`;
        const server2 = $(row).find("td").eq(9).find("a").eq(1).attr("href");
        const server3 = $(row).find("td").eq(9).find("a").eq(2).attr("href");
        const size = $(tds[7]).text().toUpperCase().trim();
        const pages = $(tds[6]).text().trim();
        const publisher = $(tds[3]).text().trim();
        const bookDetails = `${bookName}_${fileType}`;
        if (!uniqueBooks.has(bookDetails) && fileType == "pdf") {
          searchResults.push({
            poster: Poster.replace("_small", ""),
            authors: bookAuthers,
            publishers: publisher,
            title: bookName,
            year: yearOfPub,
            lang: language,
            pages: pages,
            book_url: Url,
            download_server: server1,
            download_size: downloadSize,
          });
          uniqueBooks.add(bookDetails);
        }
      } catch (e) {}
    });
    if (searchResults.length === 0) {
      return { status: 200, results: [] };
    }
    return { status: 200, results: searchResults };
  } catch (error) {
    if (!response?.ok) {
      return { status: 503, results: [] };
    }
    return { status: 404, results: [] };
  }
}

export async function getBookDetails(sub_url: string) {
  try {
    const response = await fetch("https://libgen.gs/" + sub_url);
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);
    const container = $("div.container-fluid");
    const description = container
      .find("div.col-12.order-6.float-left")
      .text()
      .trim();

    return description.replaceAll(/\.([a-zA-Z])/g, ".\n$1");
  } catch (error) {
    return null;
  }
}

export async function extractLink(url: string) {
  try {
    const response = await fetch(`${url}`);
    const htmlString = await response.text(); // get HTML text
    const $ = cheerio.load(htmlString); // parse with cheerio
    const link: string = $("#main").find("a").attr("href"); // find #main > first <a> href
    return "https://libgen.gs/" + link;
  } catch (error: any) {
    console.error("Error fetching the URL:", error);
    return error;
  }
}

export const formattedSpeed = (speed: number) => {
  if (speed < 1024) {
    return speed.toFixed(2);
  } else if (speed < 1024 * 1024) {
    return (speed / 1024).toFixed(2);
  } else if (speed < 1024 * 1024 * 1024) {
    return (speed / (1024 * 1024)).toFixed(2);
  } else {
    return (speed / (1024 * 1024 * 1024)).toFixed(2);
  }
};

export const getSpeedUnit = (speed: number) => {
  if (speed < 1024) {
    return "KB/S";
  } else if (speed < 1024 * 1024) {
    return "MB/S";
  } else if (speed < 1024 * 1024 * 1024) {
    return "GB/S"; // Corrected from "GB/S" to "MB/S"
  } else {
    return "GB/S";
  }
};

export const parseDownloadSize = (sizeString: string): number | undefined => {
  const regex = /([\d.]+)\s*(KB|MB|GB)/i;
  const match = sizeString.match(regex);
  if (!match) return undefined;

  const size = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  switch (unit) {
    case "KB":
      return size * 1024;
    case "MB":
      return size * 1024 * 1024;
    case "GB":
      return size * 1024 * 1024 * 1024;
    default:
      return undefined;
  }
};

// Helpers
export const sanitizeFileName = (name: string) => {
  return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
};

export const unsanitizeFileName = (sanitizedName: string) => {
  const withSpaces = sanitizedName.replace(/_/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

export function formattedTime(seconds: number): string {
  if (!isFinite(seconds)) return "∞";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num: number): string => String(num).padStart(2, "0");

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  } else {
    return `${pad(mins)}:${pad(secs)}`;
  }
}
