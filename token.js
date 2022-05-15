// @ts-check

import clientInfo from "./client.json" assert { type: "json" };
import { create } from "https://deno.land/x/pkce_deno@v2.0/mod.ts";
import { AuthorizationCodeGrant } from "https://deno.land/x/oauth2_deno@v1.1.2/mod.ts";

const { codeVerifier, codeChallenge } = create();

console.log(
  `https://app-api.pixiv.net/web/v1/login?code_challenge=${codeChallenge}&code_challenge_method=S256&client=pixiv-android`
);

const client = new AuthorizationCodeGrant({
  authorizationEndpointURI: "https://app-api.pixiv.net/web/v1/login",
  tokenEndpointURI: "https://oauth.secure.pixiv.net/auth/token",
  clientId: clientInfo.id,
  clientSecret: clientInfo.secret,
  redirectURI: "https://app-api.pixiv.net/web/v1/users/auth/pixiv/callback",
});

const code = prompt("Please enter your PKCE code:");
if (!code) {
  console.log("No code provided");
  Deno.exit(1);
}

const responseApi = await client.requestToken({
  code,
  parameters: {
    code_verifier: codeVerifier,
    refresh_token: "",
  },
});
await Deno.writeTextFile("token.json", JSON.stringify(responseApi, null, 2));
