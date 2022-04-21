const footers = [
    "check out my projects on <a href='https://github.com/boingboomtschak'>GitHub</a>!",
    "see you, space cowboy...",
    "the beast that shouted 'i' at the heart of the world"
];
$("#footer-text").html(footers[Math.floor(Math.random()*footers.length)]);