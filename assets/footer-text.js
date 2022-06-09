const footers = [
    "check out my projects on <a href='https://github.com/boingboomtschak'>github</a>.",
    "see you, space cowboy...",
    "easy come, easy go...",
    "you're gonna carry that weight.",
    "the beast that shouted 'I' at the heart of the world.",
    "in the still darkness.",
    "the sickness unto death, and then...",
    "midway upon the journey of our life, <br /> I found myself within a forest dark...",
    "behold the beast, for which I have turned back, <br /> do thou protect me from her, famous sage.",
    "then he moved on, and I behind him followed.",
    "all hope abandon, ye who enter in!"
];
$("#footer-text").html(footers[Math.floor(Math.random()*footers.length)]);