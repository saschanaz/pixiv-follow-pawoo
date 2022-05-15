// @ts-check

import token from "./token.json" assert { type: "json" };

const host = "https://app-api.pixiv.net";

/**
 * @param {"public" | "private"} restrict
 */
async function fetchFollowings(restrict) {
  const following = new URL("/v1/user/following", host);
  following.searchParams.set("user_id", token.user.id);
  following.searchParams.set("restrict", restrict);

  let next = following.toString();
  const users = [];

  while (next) {
    const response = await fetch(next, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    const json = await response.json();
    users.push(...json.user_previews);
    console.log(
      json.user_previews.map((/** @type {*} */ u) => u.user.name).join(", ")
    );
    console.log(json.next_url);
    next = json.next_url;
  }
  return users;
}

const publicFollowings = await fetchFollowings("public");
const privateFollowings = await fetchFollowings("private");
await Deno.writeTextFile(
  "followings.json",
  JSON.stringify(
    { public: publicFollowings, private: privateFollowings },
    null,
    2
  )
);
