function shuffle(arr) {
    let curInd = arr.length, randInd;
    while (curInd != 0) {
        randInd = Math.floor(Math.random() * curInd);
        curInd--;
        [arr[curInd], arr[randInd]] = [arr[randInd], arr[curInd]];
    }
}

let banners = [
    "2019.gif", "affection.gif", "angelz_button.gif",
    "aoltos_a.gif", "banshee.gif", "bestvieweddesktop.gif",
    "bunbrowser.gif", "bvbstar.gif", "cd_rom.gif",
    "censorship.gif", "cfs.gif", "chill_pill.gif",
    "computerupdated.png", "covid-19.gif", "dg.png",
    "help_im_online.gif", "htmltags.gif", "imaginaryland.gif",
    "nowhere.gif", "screw.gif", "self.gif",
    "site_best_viewed_with_monitor.gif", "tidw.gif", "web3.gif",
    "bookmark.gif", "drpepper.gif", "glitch.gif",
    "hair.png", "internetprivacy.gif", "lainblinkie.jpg",
    "minecraft.gif", "pepsi.gif"
];

shuffle(banners);

$("#banner1").attr("src", "/assets/banners/" + banners[0]);
$("#banner2").attr("src", "/assets/banners/" + banners[1]);
$("#banner3").attr("src", "/assets/banners/" + banners[2]);
$("#banner4").attr("src", "/assets/banners/" + banners[3]);
