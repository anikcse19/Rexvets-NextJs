if (!self.define) {
  let e,
    a = {};
  const i = (i, s) => (
    (i = new URL(i + ".js", s).href),
    a[i] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = i), (e.onload = a), document.head.appendChild(e);
        } else (e = i), importScripts(i), a();
      }).then(() => {
        let e = a[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (s, c) => {
    const b =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (a[b]) return;
    let r = {};
    const o = (e) => i(e, b),
      n = { module: { uri: b }, exports: r, require: o };
    a[b] = Promise.all(s.map((e) => n[e] || o(e))).then((e) => (c(...e), r));
  };
}
define(["./workbox-e9849328"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "163fcca54b0cda5f0368afd690e1665f",
        },
        {
          url: "/_next/static/UsRiuRvUvZKFd-wQlIIsB/_buildManifest.js",
          revision: "69f4aecf2fd94c92907a7e6d3128b89d",
        },
        {
          url: "/_next/static/UsRiuRvUvZKFd-wQlIIsB/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/1180.22bb552d6d3ea4ee.js",
          revision: "22bb552d6d3ea4ee",
        },
        {
          url: "/_next/static/chunks/1781.541ea11817e7b4ca.js",
          revision: "541ea11817e7b4ca",
        },
        {
          url: "/_next/static/chunks/2445-866c3d92ccff4713.js",
          revision: "866c3d92ccff4713",
        },
        {
          url: "/_next/static/chunks/2771-8330d0cb0c12e3c0.js",
          revision: "8330d0cb0c12e3c0",
        },
        {
          url: "/_next/static/chunks/2861-92b6ca06715368db.js",
          revision: "92b6ca06715368db",
        },
        {
          url: "/_next/static/chunks/3118-101f2642a46e255e.js",
          revision: "101f2642a46e255e",
        },
        {
          url: "/_next/static/chunks/3135.ff3e7eac12a48bd3.js",
          revision: "ff3e7eac12a48bd3",
        },
        {
          url: "/_next/static/chunks/33b75b42.a90f1b1265663488.js",
          revision: "a90f1b1265663488",
        },
        {
          url: "/_next/static/chunks/33e14e32-a89be4cef32f1b18.js",
          revision: "a89be4cef32f1b18",
        },
        {
          url: "/_next/static/chunks/3510.8460767f36814c30.js",
          revision: "8460767f36814c30",
        },
        {
          url: "/_next/static/chunks/3f10c95a-c772b91fa73f5ff2.js",
          revision: "c772b91fa73f5ff2",
        },
        {
          url: "/_next/static/chunks/3f731c04-a323c04129ac565c.js",
          revision: "a323c04129ac565c",
        },
        {
          url: "/_next/static/chunks/4142-b18007e42e3eb0b9.js",
          revision: "b18007e42e3eb0b9",
        },
        {
          url: "/_next/static/chunks/4285.99e8d0dfb70b4908.js",
          revision: "99e8d0dfb70b4908",
        },
        {
          url: "/_next/static/chunks/4673.b746ce92a5965bd1.js",
          revision: "b746ce92a5965bd1",
        },
        {
          url: "/_next/static/chunks/478-496e93b215a41175.js",
          revision: "496e93b215a41175",
        },
        {
          url: "/_next/static/chunks/539845e3-ad52ab728adec038.js",
          revision: "ad52ab728adec038",
        },
        {
          url: "/_next/static/chunks/5398b9db-b434432425cb1ad8.js",
          revision: "b434432425cb1ad8",
        },
        {
          url: "/_next/static/chunks/5528.cfc97711af25e471.js",
          revision: "cfc97711af25e471",
        },
        {
          url: "/_next/static/chunks/5754.962a9e70d89c76d8.js",
          revision: "962a9e70d89c76d8",
        },
        {
          url: "/_next/static/chunks/5875.82c7d9a7ec5b13b9.js",
          revision: "82c7d9a7ec5b13b9",
        },
        {
          url: "/_next/static/chunks/6182.8296f1d71b6361cc.js",
          revision: "8296f1d71b6361cc",
        },
        {
          url: "/_next/static/chunks/6512.144ff0781c4134ee.js",
          revision: "144ff0781c4134ee",
        },
        {
          url: "/_next/static/chunks/6949-b46f9fa49a48f582.js",
          revision: "b46f9fa49a48f582",
        },
        {
          url: "/_next/static/chunks/7185.15ad444f67e5a9b0.js",
          revision: "15ad444f67e5a9b0",
        },
        {
          url: "/_next/static/chunks/7722.900ed0d8888e05cb.js",
          revision: "900ed0d8888e05cb",
        },
        {
          url: "/_next/static/chunks/7735-4ed5e72e4f27dfaf.js",
          revision: "4ed5e72e4f27dfaf",
        },
        {
          url: "/_next/static/chunks/8091-2b6bc0b5a14304b8.js",
          revision: "2b6bc0b5a14304b8",
        },
        {
          url: "/_next/static/chunks/8344-3b05b7456a43da8f.js",
          revision: "3b05b7456a43da8f",
        },
        {
          url: "/_next/static/chunks/8571-c16a096579016e1a.js",
          revision: "c16a096579016e1a",
        },
        {
          url: "/_next/static/chunks/8710.3f934e7afea6a003.js",
          revision: "3f934e7afea6a003",
        },
        {
          url: "/_next/static/chunks/9179.aa08d3719be16839.js",
          revision: "aa08d3719be16839",
        },
        {
          url: "/_next/static/chunks/9216.4969afad8f2f9520.js",
          revision: "4969afad8f2f9520",
        },
        {
          url: "/_next/static/chunks/9422.0c3be922e9a212f9.js",
          revision: "0c3be922e9a212f9",
        },
        {
          url: "/_next/static/chunks/9435.e5e19a1b90569937.js",
          revision: "e5e19a1b90569937",
        },
        {
          url: "/_next/static/chunks/9509-325f564c2b76088b.js",
          revision: "325f564c2b76088b",
        },
        {
          url: "/_next/static/chunks/9837.d101a839295b3ea8.js",
          revision: "d101a839295b3ea8",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-1c61ca2adee7c34f.js",
          revision: "1c61ca2adee7c34f",
        },
        {
          url: "/_next/static/chunks/app/api/test-route/route-1c61ca2adee7c34f.js",
          revision: "1c61ca2adee7c34f",
        },
        {
          url: "/_next/static/chunks/app/donate/page-63bc832e6f5b53d6.js",
          revision: "63bc832e6f5b53d6",
        },
        {
          url: "/_next/static/chunks/app/donation-card-info/page-63bc832e6f5b53d6.js",
          revision: "63bc832e6f5b53d6",
        },
        {
          url: "/_next/static/chunks/app/donation/page-3516ee5d9744455f.js",
          revision: "3516ee5d9744455f",
        },
        {
          url: "/_next/static/chunks/app/error-4d0e9fc3a7e9765e.js",
          revision: "4d0e9fc3a7e9765e",
        },
        {
          url: "/_next/static/chunks/app/layout-7cb74b570a1860aa.js",
          revision: "7cb74b570a1860aa",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-1c61ca2adee7c34f.js",
          revision: "1c61ca2adee7c34f",
        },
        {
          url: "/_next/static/chunks/app/not-found-1c61ca2adee7c34f.js",
          revision: "1c61ca2adee7c34f",
        },
        {
          url: "/_next/static/chunks/app/page-774ea355e3159fa7.js",
          revision: "774ea355e3159fa7",
        },
        {
          url: "/_next/static/chunks/app/video-call/page-1cbf82d79725af20.js",
          revision: "1cbf82d79725af20",
        },
        {
          url: "/_next/static/chunks/app/what-we-treat/page-ea5b6f788faa9a04.js",
          revision: "ea5b6f788faa9a04",
        },
        {
          url: "/_next/static/chunks/c7fe877c.743d3d888bbffedc.js",
          revision: "743d3d888bbffedc",
        },
        {
          url: "/_next/static/chunks/c99dd624-d82db71ea1d4c7e3.js",
          revision: "d82db71ea1d4c7e3",
        },
        {
          url: "/_next/static/chunks/framework-7f2ac1d71728b886.js",
          revision: "7f2ac1d71728b886",
        },
        {
          url: "/_next/static/chunks/main-9eb3cd4f0b03001c.js",
          revision: "9eb3cd4f0b03001c",
        },
        {
          url: "/_next/static/chunks/main-app-bffce186351d3d3f.js",
          revision: "bffce186351d3d3f",
        },
        {
          url: "/_next/static/chunks/pages/_app-46b819c2e5369bda.js",
          revision: "46b819c2e5369bda",
        },
        {
          url: "/_next/static/chunks/pages/_error-36266366dfbd7665.js",
          revision: "36266366dfbd7665",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-d2bbd9225dd8ab59.js",
          revision: "d2bbd9225dd8ab59",
        },
        {
          url: "/_next/static/css/3189894d25183ed6.css",
          revision: "3189894d25183ed6",
        },
        {
          url: "/_next/static/css/5e791358f066ece2.css",
          revision: "5e791358f066ece2",
        },
        {
          url: "/_next/static/css/7be37b31674b87d2.css",
          revision: "7be37b31674b87d2",
        },
        {
          url: "/_next/static/css/92562e936f84d318.css",
          revision: "92562e936f84d318",
        },
        {
          url: "/_next/static/media/33aa39707f7fa2b2-s.p.woff2",
          revision: "b38648a61c4208079adce4e4c40a4e34",
        },
        {
          url: "/_next/static/media/401e0cd2ecebe989-s.p.woff",
          revision: "bb4937a2c7a648de7599e81a50423ddc",
        },
        {
          url: "/_next/static/media/5a87fff34e8c406e-s.p.otf",
          revision: "74f42337dda036f6fcf86f282a316b7f",
        },
        {
          url: "/_next/static/media/5ad1c05db953a338-s.p.ttf",
          revision: "47fe1c58f44f53c78e65712a2581230f",
        },
        {
          url: "/_next/static/media/a19683daeb9405cd-s.p.woff2",
          revision: "0019a3a88cd6b8459fb73a617dee9166",
        },
        {
          url: "/_next/static/media/be77e8874e84bb02-s.p.ttf",
          revision: "6aea6bc41f902e6e21db5d54c9f77261",
        },
        {
          url: "/_next/static/media/c13f26aec537175e-s.p.otf",
          revision: "af54e77faed29b7e00745bd4995889c2",
        },
        {
          url: "/_next/static/media/championBadge3.f1554505.webp",
          revision: "354274548772bd41abca12c0e3973eca",
        },
        {
          url: "/_next/static/media/ebc7e891c5b3dfc3-s.p.woff",
          revision: "2e5e93eaa597cebd24b9c73bdada9c8e",
        },
        {
          url: "/_next/static/media/featureImage1-1.6dd3a79d.webp",
          revision: "1477a694e6d0fad3cb7eb15170b3fcdb",
        },
        {
          url: "/_next/static/media/featureImage3-3.95c6c7b1.webp",
          revision: "66083e40ad9a3d758f274eecfbb0d095",
        },
        {
          url: "/_next/static/media/friendBadge3.ef58a3d5.webp",
          revision: "da0d6d0d3161e7e45be5cc0187a0886e",
        },
        {
          url: "/_next/static/media/heroBadge4.83d78502.webp",
          revision: "433ae3e8e3cc948aea8b4435439f640c",
        },
        {
          url: "/_next/static/media/marquee1.4bc96dd5.webp",
          revision: "15c199aa0a1d8b459c108e2e7a04d85c",
        },
        {
          url: "/_next/static/media/marquee2.0e915188.webp",
          revision: "7b06723c5f2c5e4fb00ad4fa4a30d949",
        },
        {
          url: "/_next/static/media/marquee3.3334691c.webp",
          revision: "6fb33887d9e9963ffd9ab678bead3721",
        },
        {
          url: "/_next/static/media/marquee4.9e64fcbc.webp",
          revision: "32f4b07a209b489cb54a1a0e5d7e125f",
        },
        {
          url: "/_next/static/media/mblImg.7c6175bf.webp",
          revision: "782ccb9970813ccdea1f760db262d030",
        },
        {
          url: "/android-chrome-192x192.png",
          revision: "fb4cad7aa195f7380b0e601ffafba5e4",
        },
        {
          url: "/android-chrome-512x512.png",
          revision: "0833a3493438701b5a238ba0be9a05d9",
        },
        {
          url: "/apple-touch-icon.png",
          revision: "2832eff8cfe36ede51119052073c9885",
        },
        {
          url: "/favicon-16x16.png",
          revision: "e6a35e4cb3424e749a55405597c4efdf",
        },
        {
          url: "/favicon-32x32.png",
          revision: "e800cde428286940d07d4bc8e60cf40c",
        },
        { url: "/favicon.ico", revision: "a5226852f1952abf45c948ab94035b5e" },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        {
          url: "/fonts/Garet-Book.otf",
          revision: "74f42337dda036f6fcf86f282a316b7f",
        },
        {
          url: "/fonts/Garet-Book.ttf",
          revision: "6aea6bc41f902e6e21db5d54c9f77261",
        },
        {
          url: "/fonts/Garet-Book.woff",
          revision: "bb4937a2c7a648de7599e81a50423ddc",
        },
        {
          url: "/fonts/Garet-Book.woff2",
          revision: "b38648a61c4208079adce4e4c40a4e34",
        },
        {
          url: "/fonts/Garet-Heavy.otf",
          revision: "af54e77faed29b7e00745bd4995889c2",
        },
        {
          url: "/fonts/Garet-Heavy.ttf",
          revision: "47fe1c58f44f53c78e65712a2581230f",
        },
        {
          url: "/fonts/Garet-Heavy.woff",
          revision: "2e5e93eaa597cebd24b9c73bdada9c8e",
        },
        {
          url: "/fonts/Garet-Heavy.woff2",
          revision: "0019a3a88cd6b8459fb73a617dee9166",
        },
        {
          url: "/fonts/gothamnarrowoffice_bold.otf",
          revision: "f6bdcb85cbb41f610b13cc5c31ab3ffe",
        },
        {
          url: "/fonts/gothamnarrowoffice_bolditalic.otf",
          revision: "b8858057a69cac82f7d0f6d1ea4febfd",
        },
        {
          url: "/fonts/gothamoffice_bold.otf",
          revision: "dc317dc28862ef235c26026a07080df7",
        },
        {
          url: "/fonts/gothamoffice_bolditalic.otf",
          revision: "e9aa6079791f3d83527be6fb52a3a56c",
        },
        {
          url: "/fonts/gothamoffice_italic.otf",
          revision: "4bd0f3079c6b20d854b9ac5cf18533af",
        },
        {
          url: "/fonts/gothamoffice_regular.otf",
          revision: "82b3e6c63f2a7d05e9840159c90bb414",
        },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        {
          url: "/images/Blogs/Blog1/MainImage.webp",
          revision: "836e849861a0a7672d3d813c8577ad18",
        },
        {
          url: "/images/Blogs/Blog1/img1.webp",
          revision: "be8ddb7cbb8431a8452b31ee10036304",
        },
        {
          url: "/images/Blogs/Blog1/img2.webp",
          revision: "b6baec254b723b6f5ad5de000ae3345c",
        },
        {
          url: "/images/Blogs/Blog1/img3.webp",
          revision: "a3e02d7e94833c725065b869aab68b9a",
        },
        {
          url: "/images/Blogs/Blog1/img4.webp",
          revision: "6f46f10ac584bb62e94a3184a931516a",
        },
        {
          url: "/images/Blogs/Blog1/img5.webp",
          revision: "68c57d52685731400dffc84180aaf53c",
        },
        {
          url: "/images/Blogs/Blog1/petBlogImage4.webp",
          revision: "1330b6abfa47d2cf7de0a085711a7a27",
        },
        {
          url: "/images/Blogs/Blog1/petBlogImage5.webp",
          revision: "023edbc697fd1355ddffaa491b16303e",
        },
        {
          url: "/images/Blogs/Blog1/petBlogImage6.webp",
          revision: "2f711e9514d150d53aae360d6c89d3d6",
        },
        {
          url: "/images/Blogs/Blog2/MainImage.webp",
          revision: "b10aa02b546eabb27afe7604ec97a4fa",
        },
        {
          url: "/images/Blogs/Blog2/img1.webp",
          revision: "c780039e7325aa4460622148b9a2d4a5",
        },
        {
          url: "/images/Blogs/Blog2/img2.webp",
          revision: "e2b8dc5222af97d02b5afb5464bf8f1a",
        },
        {
          url: "/images/Blogs/Blog2/img3.webp",
          revision: "5b24524ed0ff756b50caa5192d250b32",
        },
        {
          url: "/images/Blogs/Blog2/img4.webp",
          revision: "337f6d18a862c6fc2a4871ccc672dd21",
        },
        {
          url: "/images/Blogs/Blog3/MainImage.webp",
          revision: "84ebdeeb4cce7cfde0aff28cab76a67b",
        },
        {
          url: "/images/Blogs/Blog3/img1.webp",
          revision: "c326f61fd50c1f66c3d219be32c84f09",
        },
        {
          url: "/images/Blogs/Blog3/img2.webp",
          revision: "010d471c793d0a3b055c453fb7b8b919",
        },
        {
          url: "/images/Blogs/Blog3/img3.webp",
          revision: "30bbee5e6a2fddf8bf00e4f1b7d2e707",
        },
        {
          url: "/images/Homepage/Burger.webp",
          revision: "6f1ed38f8059d7735829fc942700eeb9",
        },
        {
          url: "/images/Homepage/ChatBalloon.webp",
          revision: "dbed9d908a06e6dceb92c56bbcf493dc",
        },
        {
          url: "/images/Homepage/Donateimg1.webp",
          revision: "f4119b7ec032986c72d1649c822c4150",
        },
        {
          url: "/images/Homepage/Donateimg2.webp",
          revision: "58da58cce096767b8a63e3506ed1f323",
        },
        {
          url: "/images/Homepage/FriendofRex.webp",
          revision: "5cdcbdc50e5babad570a77f1b950ca0e",
        },
        {
          url: "/images/Homepage/Hero.webp",
          revision: "424bec06076acfcadd4ea82f17f42aa4",
        },
        {
          url: "/images/Homepage/Hero2.webp",
          revision: "16a9afcdfeb4636dff4cb969f189c49e",
        },
        {
          url: "/images/Homepage/Herobadge.webp",
          revision: "53e37a0d137267c98ad234c51cb9c579",
        },
        {
          url: "/images/Homepage/Logo.svg",
          revision: "cf21811bf984a6d819299913746d056e",
        },
        {
          url: "/images/Homepage/Logo.webp",
          revision: "8809e6f68dfaea44a4a7779aad20debb",
        },
        {
          url: "/images/Homepage/LogoBlack.webp",
          revision: "e828870f42454b4cbdf9eba50c2d2f62",
        },
        {
          url: "/images/Homepage/LogoR.webp",
          revision: "2d499719ac2ff26112382670f50be2cf",
        },
        {
          url: "/images/Homepage/LogoWhite.webp",
          revision: "178d0af7e2bc89d291c6eae75812ccdd",
        },
        {
          url: "/images/Homepage/LogoYellow.webp",
          revision: "561bc54b81ed25626f1113a79dc1fe65",
        },
        {
          url: "/images/Homepage/PawTexture.webp",
          revision: "f5e3e9a92a157ffef3c5fec11bd1fb7c",
        },
        {
          url: "/images/Homepage/PetStickers/cat1.webp",
          revision: "8ac3f28a0bc8ded87f6a362196e29a92",
        },
        {
          url: "/images/Homepage/PetStickers/cat2.webp",
          revision: "4fc5164ed5d793810d80968f0af0b3d8",
        },
        {
          url: "/images/Homepage/PetStickers/catpeeking.webp",
          revision: "d7d9ab94924e6df4e555350daf782bbb",
        },
        {
          url: "/images/Homepage/PetStickers/dog1.webp",
          revision: "6f8a24733c2ba74210661a07b4d04ab5",
        },
        {
          url: "/images/Homepage/PetStickers/dog2.webp",
          revision: "dcce90d41c2efa434d317adeb3fb7778",
        },
        {
          url: "/images/Homepage/PetStickers/dog3.webp",
          revision: "8cb8cc360a3755c42cf7514a3a8e4228",
        },
        {
          url: "/images/Homepage/PetStickers/dog4.webp",
          revision: "c38d50ee84a142753d4c425ea4a97708",
        },
        {
          url: "/images/Homepage/VetPhoto.webp",
          revision: "72414c97fe64a865f306eb0b89a61d70",
        },
        {
          url: "/images/Homepage/VetPhotoHover.webp",
          revision: "a6080c8b6059199fcc530667296fbcae",
        },
        {
          url: "/images/Homepage/benefitsImage.webp",
          revision: "63346a6247c8116e0f7e69072e07556c",
        },
        {
          url: "/images/Homepage/bg1-assets/bg1.webp",
          revision: "4279eba9ad59450cb6dfa8cf95fc8415",
        },
        {
          url: "/images/Homepage/bg1.webp",
          revision: "3475676ff3faf89c7c71149aca8d5a9b",
        },
        {
          url: "/images/Homepage/bgDonate.webp",
          revision: "19b7541b040cfb194522cb49b58c3777",
        },
        {
          url: "/images/Homepage/bgPrescribe.webp",
          revision: "85aae6f3d116e8bc926960968b3d1844",
        },
        {
          url: "/images/Homepage/bgSupport.webp",
          revision: "b82fdb6d4a299a212f71741d372fdb58",
        },
        {
          url: "/images/Homepage/bgwidget.webp",
          revision: "60bd4c0fafbdc65d7a1be071171c4b62",
        },
        {
          url: "/images/Homepage/championBadge3.webp",
          revision: "354274548772bd41abca12c0e3973eca",
        },
        {
          url: "/images/Homepage/championbadge.webp",
          revision: "644015006e5697d2fb70869c838100c2",
        },
        {
          url: "/images/Homepage/chicle-blue-2.webp",
          revision: "8ec673f096a7e28ec8cdceba2ac23c77",
        },
        {
          url: "/images/Homepage/circle-dots.webp",
          revision: "9b689f3a07db2da7661a03bce45717cf",
        },
        {
          url: "/images/Homepage/circle-orange-2.webp",
          revision: "e4e1b5c4d70b8fed1a0de520b041432b",
        },
        {
          url: "/images/Homepage/circle-orange.webp",
          revision: "cc9cbeff985e0ee045a094720bd29346",
        },
        {
          url: "/images/Homepage/circle-small-blue.webp",
          revision: "6656aa59eff253e3043e83fd4d7584a8",
        },
        {
          url: "/images/Homepage/doc1.webp",
          revision: "3bab69fa443725f203456773e497a108",
        },
        {
          url: "/images/Homepage/doc2.webp",
          revision: "00bde15cb707354097aac49db48150d5",
        },
        {
          url: "/images/Homepage/doctor.webp",
          revision: "cb22f8f484634f66154cd5271f5ef746",
        },
        {
          url: "/images/Homepage/donatenow.webp",
          revision: "a2a7c5c3fb65ea7dbf94213b060912fa",
        },
        {
          url: "/images/Homepage/ext-blue.webp",
          revision: "737d874bca9a7948dcc8aa4837677cdc",
        },
        {
          url: "/images/Homepage/ext-orange.webp",
          revision: "6f483f0c18bc8d04380ef8f047e19b59",
        },
        {
          url: "/images/Homepage/featureImage1-1.webp",
          revision: "1477a694e6d0fad3cb7eb15170b3fcdb",
        },
        {
          url: "/images/Homepage/featureImage2-2.webp",
          revision: "09286587ca8b056ee6e55cc090ce2cfc",
        },
        {
          url: "/images/Homepage/featureImage3-3.webp",
          revision: "66083e40ad9a3d758f274eecfbb0d095",
        },
        {
          url: "/images/Homepage/footer-line.webp",
          revision: "b2771f54c377281690baf26b0aae8a4b",
        },
        {
          url: "/images/Homepage/friendBadge3.webp",
          revision: "da0d6d0d3161e7e45be5cc0187a0886e",
        },
        {
          url: "/images/Homepage/heroBadge4.webp",
          revision: "433ae3e8e3cc948aea8b4435439f640c",
        },
        {
          url: "/images/Homepage/hiw1.webp",
          revision: "87a8772fe66f4b3eb7629d1c7b1db209",
        },
        {
          url: "/images/Homepage/hiw2.webp",
          revision: "54d52b7f0d0971e0b8e81b166bd7caec",
        },
        {
          url: "/images/Homepage/hiw3.webp",
          revision: "cdb4295c529a8e69da8d8124a373a6a6",
        },
        {
          url: "/images/Homepage/image1.webp",
          revision: "d64c7c4caff08f86b94a3a41edc5418a",
        },
        {
          url: "/images/Homepage/imgShop.webp",
          revision: "4c1e3524d0e7ed7c8badd2e06fe133d5",
        },
        {
          url: "/images/Homepage/imgShop2.webp",
          revision: "7169e81ba0f883f5e77764cf732dde4e",
        },
        {
          url: "/images/Homepage/line-circle-blue.webp",
          revision: "7389bb9d714de6007831c1d85d3efa71",
        },
        {
          url: "/images/Homepage/loaderR.webp",
          revision: "5007ccb62b381213461c4b8c086c507c",
        },
        {
          url: "/images/Homepage/marquee1.webp",
          revision: "15c199aa0a1d8b459c108e2e7a04d85c",
        },
        {
          url: "/images/Homepage/marquee2.webp",
          revision: "7b06723c5f2c5e4fb00ad4fa4a30d949",
        },
        {
          url: "/images/Homepage/marquee3.webp",
          revision: "6fb33887d9e9963ffd9ab678bead3721",
        },
        {
          url: "/images/Homepage/marquee4.webp",
          revision: "32f4b07a209b489cb54a1a0e5d7e125f",
        },
        {
          url: "/images/Homepage/mblImg.webp",
          revision: "782ccb9970813ccdea1f760db262d030",
        },
        {
          url: "/images/Homepage/membershipsbg1.webp",
          revision: "21de8a74f2ed9b455b883da17fcb3907",
        },
        {
          url: "/images/Homepage/mobilerex.webp",
          revision: "58c8c36cda69be3d1ba7f6637267a4e3",
        },
        {
          url: "/images/Homepage/par-1.webp",
          revision: "8e664846cde22a7af00989102853e2ce",
        },
        {
          url: "/images/Homepage/pattern1.webp",
          revision: "d7f3fd500b0d1a0debf6122bba1199f1",
        },
        {
          url: "/images/Homepage/pattern2.webp",
          revision: "28b7576147ab528747dc371dc0be37ab",
        },
        {
          url: "/images/Homepage/pattern3.webp",
          revision: "b3174f8b7149e9c53781843770c45b6a",
        },
        {
          url: "/images/Homepage/pattern4-1.webp",
          revision: "e67d48e34e74679f34e36cab483a32ac",
        },
        {
          url: "/images/Homepage/pattern4-2.webp",
          revision: "80c97bc829ba87e7986c0fd326476dcf",
        },
        {
          url: "/images/Homepage/plus-blue.webp",
          revision: "03e20ebc8f51058bcce436eca71e14c0",
        },
        {
          url: "/images/Homepage/plus-orange.webp",
          revision: "22912a59ddaf1540dbf9f35f68606e0f",
        },
        {
          url: "/images/Homepage/product1.webp",
          revision: "2f376381af883e092ac0cbc99e87172b",
        },
        {
          url: "/images/Homepage/product2.webp",
          revision: "88720e9f7d799910c444cddb80af34fa",
        },
        {
          url: "/images/Homepage/product3.webp",
          revision: "115ec138df60e9217019ef4d0e5e738a",
        },
        {
          url: "/images/Homepage/product4.webp",
          revision: "4a56fb1de422e21987db11a573ff8631",
        },
        {
          url: "/images/Homepage/product5.webp",
          revision: "8faadfc081e3d8ccd5e7e9c01d79be2c",
        },
        {
          url: "/images/Homepage/product6.webp",
          revision: "2f376381af883e092ac0cbc99e87172b",
        },
        {
          url: "/images/Homepage/profile1.webp",
          revision: "59e0dc9ce7c7f9b3aaab2a11830e9c48",
        },
        {
          url: "/images/Homepage/profile2.webp",
          revision: "545e3e11b3f44e72ef2939f27dd16945",
        },
        {
          url: "/images/Homepage/profile3.webp",
          revision: "4861c0cb0135d5576e9401e2e5113a5c",
        },
        {
          url: "/images/Homepage/profile4.webp",
          revision: "c97d32e832e2c51926f0e8c31c658c12",
        },
        {
          url: "/images/Homepage/profile5.webp",
          revision: "898861a825a022a959e00dd95d55490f",
        },
        {
          url: "/images/Homepage/profile6.webp",
          revision: "a3e8a58b76d212237deb2e70e3356047",
        },
        {
          url: "/images/Homepage/profileDoc.webp",
          revision: "55e88ed44e08141ec2a4d0f0691c92b8",
        },
        {
          url: "/images/Homepage/shape1.webp",
          revision: "e7e00bc22dbc5d79d514cc01f4ca1d96",
        },
        {
          url: "/images/Homepage/square-blue.webp",
          revision: "a8669bcf3621788e5f3dda078ca9db82",
        },
        {
          url: "/images/Homepage/square-dots-orange.webp",
          revision: "d2e580eb280ae7571ceb361163cea6bd",
        },
        {
          url: "/images/Homepage/square-rotate.webp",
          revision: "a750a886fb510bea00f317218eafd319",
        },
        {
          url: "/images/Homepage/svg13.svg",
          revision: "de78952a6078051f3c7f9f11f8ab6960",
        },
        {
          url: "/images/Homepage/test1.webp",
          revision: "712c14b722050409b360bfc08f57b671",
        },
        {
          url: "/images/Homepage/test2.webp",
          revision: "299d1c1ea51735d0e0520c2bf88501b1",
        },
        {
          url: "/images/Homepage/test3.webp",
          revision: "60694e2ccd3bf8c2b8ca8557c5bd3bdb",
        },
        {
          url: "/images/Homepage/trangle-orange.webp",
          revision: "6b29dfa99c7ddae29e0af2741c75a179",
        },
        {
          url: "/images/Homepage/twoPuppy.webp",
          revision: "768bc172962827d4f2a4b7b20a381bfb",
        },
        {
          url: "/images/Homepage/user.png",
          revision: "7fbb50941e0b4d36fd04b172d071bc81",
        },
        {
          url: "/images/Homepage/user_icon.png",
          revision: "c5d1f8d475be7a5d7139e06114a3fb66",
        },
        {
          url: "/images/Homepage/waiting_room.webp",
          revision: "a25cb05c6982ffb7ef4e9324d9da1623",
        },
        {
          url: "/images/Homepage/wave-blue.webp",
          revision: "14133b9ade9f85c46346b8dafb894dd9",
        },
        {
          url: "/images/Homepage/wave-orange.webp",
          revision: "60ecf72c00dd985437d929c9bd2818ee",
        },
        {
          url: "/images/Logo (Gradient).svg",
          revision: "f8731f9514beffc2cc0dc20230b93b4f",
        },
        {
          url: "/images/donate-page/Cover2.webp",
          revision: "132ffe820a2f9a7bac531cbed708a857",
        },
        {
          url: "/images/donate-page/DocIcon.webp",
          revision: "3c403360f5705fa62eb77408a331711d",
        },
        {
          url: "/images/donate-page/Stripe.webp",
          revision: "79916de74994051e1e478ad2c4657326",
        },
        {
          url: "/images/donate-page/Texture.webp",
          revision: "e8ed323d7061b836493abba3ca1266f4",
        },
        {
          url: "/images/donate-page/vet.webp",
          revision: "6aaabdd85a9cbf3ab497f8aae95d08e6",
        },
        {
          url: "/images/donate-page/vet2.webp",
          revision: "fbda8e8aaa88263779638a949623cc52",
        },
        {
          url: "/images/what-we-treat/anxiety.webp",
          revision: "7df3e7af152d1f8ad76899910b2e8cd3",
        },
        {
          url: "/images/what-we-treat/cough.webp",
          revision: "e5a8848aae41dd49afca3e6c2703fc1c",
        },
        {
          url: "/images/what-we-treat/dai.webp",
          revision: "0b3c578255ad74a1c606354a4fa37bbb",
        },
        {
          url: "/images/what-we-treat/diet.webp",
          revision: "f4e66ba47c2b978cd04cfbf0800bf53a",
        },
        {
          url: "/images/what-we-treat/dogd.png",
          revision: "fc05113a6a7bd66e860708a6682b7b2c",
        },
        {
          url: "/images/what-we-treat/dogd.webp",
          revision: "2608a90b794f97a9f61a39646b316726",
        },
        {
          url: "/images/what-we-treat/health.webp",
          revision: "d322c73e3ceef258c4f28d6b1e5a8640",
        },
        {
          url: "/images/what-we-treat/joint.webp",
          revision: "936ef2f0df0abc20bd96b79e353488fa",
        },
        {
          url: "/images/what-we-treat/mission.webp",
          revision: "b4857b26399a60044634b289d236a7ab",
        },
        {
          url: "/images/what-we-treat/prescription.webp",
          revision: "3b053d4ef93cc5ff617988dc8266b8f4",
        },
        {
          url: "/images/what-we-treat/support.webp",
          revision: "bbb4c3a3829f954690c27f860cb9acd3",
        },
        {
          url: "/images/what-we-treat/whyChoose.webp",
          revision: "865110e338b9416194d6152421135960",
        },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        {
          url: "/site.webmanifest",
          revision: "ce7ba918a05fcb1ec7af12b8676a26e8",
        },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: a,
              event: i,
              state: s,
            }) =>
              a && "opaqueredirect" === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: "OK",
                    headers: a.headers,
                  })
                : a,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const a = e.pathname;
        return !a.startsWith("/api/auth/") && !!a.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
