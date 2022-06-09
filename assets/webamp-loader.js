const Winamp = window.Webamp;

if (Webamp.browserIsSupported()) {
    console.log("Initializing Webamp...");
    const webamp = new Webamp({
        initialTracks: [
            //{ metaData: { artist: "", title: "" }, url: "" },
            { metaData: { artist: "dreamweaver", title: "hidden by light" }, url: "assets/songs/hidden-by-light.mp3" },
            { metaData: { artist: "haircuts for men", title: "戦争忘れ" }, url: "assets/songs/戦争忘れ.mp3" },
            { metaData: { artist: "Machine Girl", title: "Athoth a Go!! Go!!" }, url: "assets/songs/athoth-a-go-go.mp3" },
            { metaData: { artist: "Nmesh", title: "Climbing the Corporate Ladder" }, url: "assets/songs/climbing-the-corporate-ladder.mp3" },
        ],
        initialSkin: {
            url: "assets/wsz/winampXP.wsz"
        },
        availableSkins: [
            { url: "assets/wsz/Trinity.wsz", name: "Trinity" },
            { url: "assets/wsz/Morbamp.wsz", name: "Morbamp" },
            { url: "assets/wsz/PeoplesAmp.wsz", name: "The Peoples Amp" },
            { url: "assets/wsz/OurLastHope.wsz", name: "Our Last Hope" },
            { url: "assets/wsz/winamp98.wsz", name: "Winamp98" },
            { url: "assets/wsz/Garfield.wsz", name: "Garfield" },
            { url: "assets/wsz/winampXP.wsz", name: "WinampXP" }
        ]
    });
    webamp.renderWhenReady(document.getElementById('webamp'));
}