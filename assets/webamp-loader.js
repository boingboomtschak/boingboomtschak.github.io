const Winamp = window.Webamp;

if (Webamp.browserIsSupported() && !navigator.userAgentData.mobile) {
    console.log("Initializing Webamp...");
    const skins = [
        { url: "/assets/wsz/Twilight.wsz", name: "Twilight" },
        { url: "/assets/wsz/HomeSweetHome.wsz", name: "Home Sweet Home" },
        { url: "/assets/wsz/winampXP.wsz", name: "WinampXP" },
        { url: "/assets/wsz/winamp98.wsz", name: "Winamp98" },
        { url: "/assets/wsz/OurLastHope.wsz", name: "Our Last Hope" },
        { url: "/assets/wsz/Trinity.wsz", name: "Trinity" },
        { url: "/assets/wsz/Morbamp.wsz", name: "Morbamp" },
    ];
    const excludedFromRandom = ["Morbamp", "Trinity"];

    const songs = [
        //{ metaData: { artist: "", title: "" }, url: "" },
        { metaData: { artist: "Bôa", title: "Duvet" }, url: "/assets/songs/duvet.mp3" },
        { metaData: { artist: "Shiro Sagisu", title: "Rei-Opus IV" }, url: "/assets/songs/rei-opus-iv.mp3" },
        { metaData: { artist: "haircuts for men", title: "戦争忘れ" }, url: "/assets/songs/戦争忘れ.mp3" },
        { metaData: { artist: "dreamweaver", title: "hidden by light" }, url: "/assets/songs/hidden-by-light.mp3" },
        { metaData: { artist: "Machine Girl", title: "Athoth a Go!! Go!!" }, url: "/assets/songs/athoth-a-go-go.mp3" },
        { metaData: { artist: "Nmesh", title: "Climbing the Corporate Ladder" }, url: "/assets/songs/climbing-the-corporate-ladder.mp3" },
    ];

    let initialSkin = skins[Math.round(Math.random() * skins.length)];
    if (excludedFromRandom.includes(initialSkin.name)) initialSkin = skins[0];

    const webamp = new Webamp({
        initialTracks: songs,
        initialSkin: initialSkin,
        availableSkins: skins
    });
    webamp.renderWhenReady(document.getElementById('webamp'));
}