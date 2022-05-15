// @ts-check

import followings from "./followings.json" assert { type: "json" };

const list = [...followings.public, ...followings.private].map(
  (f) => f.user.id
);

const result = [];

for (const id of list) {
  const response = await fetch(`https://pawoo.net/oauth_authentications/${id}`);
  if (!response.redirected) {
    console.log("No pawoo", id);
    continue;
  }

  result.push(response.url);
  console.log("pawoo!", response.url);
}

await Deno.writeTextFile("pawoo.csv", result.join("\n") + "\n");
