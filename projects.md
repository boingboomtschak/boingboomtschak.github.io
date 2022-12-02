---
layout: page
title: -projects
permalink: /projects/
---

```
$ ls
```
<a href="/">../</a>

```
$ cat projects.txt
```

# projects

-----

# falling-sand-cubed

<div>
    <img src="/icons/github.svg" width="14">
    <a href="https://github.com/boingboomtschak/falling-sand-cubed">github link</a>
</div>

A 3D falling sand game, written in OpenGL for a computer graphics class final project. Uses OpenGL compute shaders to compute particle positions each frame, instanced rendering for cubes, stencil testing, and an immediate-mode GUI rendered using [Dear ImGui](https://github.com/ocornut/imgui).

<video width="560" autoplay muted loop>
    <source src="/assets/projects/falling-sand-cubed.mp4" type="video/mp4">
</video>

# cuda-boids

<div>
    <img src="/icons/github.svg" width="14">
    <a href="https://github.com/boingboomtschak/cuda-boids">github link</a>
</div>

A quick experiment in OpenGL / CUDA interop, using the boids steering model as a focus. Boids are drawn as single points and rendered from device memory. A buffer for boid objects is created with OpenGL, registered with CUDA, and then the CUDA kernel moves each boid by accessing that buffer memory directly, requiring no transfer between host and device memory. 

<video width="560" autoplay muted loop>
    <source src="/assets/projects/cuda-boids.mp4" type="video/mp4">
</video>

Boids are colored according to their heading (X component mapped to R channel, Y component mapped to G channel, Z component mapped to B channel), allowing for a primitive visualization of groupings. The movement rules followed by each boid can be weighted by constants in the program, and affect the overall order of the system.

# vulkan-playground

<div>
    <img src="/icons/github.svg" width="14">
    <a href="https://github.com/boingboomtschak/vulkan-playground">github link</a>
</div>

Various computer graphics experiments, written in Vulkan, created for class and personal investigation. Currently exploring the creation of a library to simplify the bootstrapping of new Vulkan programs, for both personal and educational use.

<video width="560" autoplay muted loop>
    <source src="/assets/projects/vulkan-playground.mp4" type="video/mp4">
</video>

# opengl-playground

<div>
    <img src="/icons/github.svg" width="14">
    <a href="https://github.com/boingboomtschak/opengl-playground">github link</a>
</div>

A series of graphics programs written with OpenGL. Most were written as part of a computer graphics class, but some are extended explorations out of class. 

<video width="560" autoplay muted loop>
    <source src="/assets/projects/opengl-playground.mp4" type="video/mp4">
</video>


# legacy projects 

-----

Older projects, some unfinished, unlikely to be picked up again in the near future. Some projects were created for hackathons or other similar competitions, which is noted in their description. 

<script src="/assets/accordion.js"></script>
<div class="site-accordion">
    <h1>hyper-sonoran-gothic</h1>
    <div>
        <div>
            <img src="/icons/github.svg" width="14">
            <a href="https://github.com/boingboomtschak/hyper-sonoran-gothic">github link</a>
        </div>
        <p>Dark, desert tones highlighted by pastel shades of mesa and pine forests. A darker terminal color scheme for the <a href="https://hyper.is/">hyper terminal</a>, based on the color palette of the SonoraBuild Minecraft server.</p>
        <img src="/assets/projects/hyper-sonoran-gothic.png" width="550">
    </div>
    <h1>hyper-sonoran-sunrise</h1>
    <div>
        <div>
            <img src="/icons/github.svg" width="14">
            <a href="https://github.com/boingboomtschak/hyper-sonoran-sunrise">github link</a>
        </div>
        <p>Light, sandier shades punctuated by punchier sun-bleached accent colors. A lighter color scheme for the <a href="https://hyper.is/">hyper terminal</a> based off the color palette of the SonoraBuild Minecraft server, with influence from Solarized Light.</p>
        <img src="/assets/projects/hyper-sonoran-sunrise.png" width="550">
    </div>
    <h1>graphite-py</h1>
    <div>
        <div>
            <img src="/icons/github.svg" width="14">
            <a href="https://github.com/boingboomtschak/graphite-py">github link</a>
        </div>
        <p>Experiment in creating a lightweight graphical tool in Python to "pixelate" an image into grayscale with variable block sizes and a discrete number of shades. Created in service of an art project.</p>
        <img src="/assets/projects/graphite-py.png" width="550">
    </div>
    <h1>sonora-rs</h1>
    <div>
        <div>
            <img src="/icons/github.svg" width="14">
            <a href="https://github.com/boingboomtschak/sonora-rs">github link</a>
        </div>
        <p>A custom Discord bot, written in Rust, using serenity-rs as a wrapper for the Discord API. Implements various Rust crates to add complex functionality to the bot with a focus on robust interpretation of user input and ease of use.</p>
    </div>
    <h1>qhess</h1>
    <div>
        <div>
            <img src="/icons/github.svg" width="14">
            <a href="https://github.com/boingboomtschak/qhess">github link</a>
        </div>
        <p>A twist on the classic game of chess, using probabilistic equations to determine where pieces will move, as well as including various rules inspired by concepts of quantum mechanics. Built for HackSU 2021.</p>
    </div>
    <h1>redistribution</h1>
    <div>
    <div>
        <img src="/icons/github.svg" width="14">
        <a href="https://github.com/boingboomtschak/redistribution">github link</a>
    </div>
        <p>A plugin for Spigot/Paperspigot Java Edition Minecraft servers to redistribute the resources of banned players to the community by way of plugin-managed item pools. Plugin handles serialization/deserialization of item pools, and manages multiple instances of pools in and out of memory, as well as ingame GUI tools to work with item pools directly.</p>
    </div>
    <h1>yttrium</h1>
    <div>
        <div>
            <img src="/icons/github.svg" width="14">
            <a href="https://github.com/boingboomtschak/yttrium">github link</a>
        </div>
        <p>A short webapp in initial stages, running on Flask, to generate Geocities/<a href="https://neocities.org/browse">Neocities</a>-style pages in a configurably randomized manner using scraped web assets.</p>
    </div>
    <h1>fieldfare</h1>
    <div>
        <div>
            <img src="/icons/github.svg" width="14">
            <a href="https://github.com/boingboomtschak/fieldfare">github link</a>
        </div>
        <p>Experiment in creating a programming language in Rust, using the <a href="https://arzg.github.io/lang/">Make a Language</a> tutorial by <a href="https://github.com/arzg">Luna Razzaghipour</a>.</p>
    </div>
    <h1>heartware</h1>
    <div>
        <div>
            <img src="/icons/github.svg" width="14">
            <a href="https://github.com/charcalope/heartware">github link</a>
        </div>
        <p>A project blending hardware and software to enable cashierless shopping and automation inventory tracking with a focus on ease of use. Uses localized pressure sensitive resistive mats along with NFC tags to track the removal of specific products by a customer. Uses a web interface built on top of Flask and SQLAlchemy to track products, as well as custom-built hardware interfacing with an Arduino board. Built for the 2020 SeattleU ACM Personal Projects Competition.</p>
    </div>
    <h1>track-SU</h1>
    <div>
        <div>
            <img src="/icons/github.svg" width="14">
            <a href="https://github.com/boingboomtschak/track-SU">github link</a>
        </div>
        <p>A multilevel warehouse pallet tracking tool with web interface using persistent narrowband IoT devices to track and store pertinent data for further analysis. Created as part of the 2019 TMobile NB IoT Hackathon in Bellevue, WA.</p>
    </div>
    <h1>lunardust</h1>
    <div>
        <div>
            <img src="/icons/github.svg" width="14">
            <a href="https://github.com/boingboomtschak/lunardust">github link</a>
        </div>
        <p>A web-based tool for receiving data from dust filtration sensors intended for use in space-suit technology. Project finalized in the NASA Space Apps Challenge 2019 with a team based in the US and India.</p>
        <img src="/assets/projects/lunardust.png" width="550">
    </div>
    <h1>shelby</h1>
    <div>
        <div>
            <img src="/icons/github.svg" width="14">
            <a href="https://github.com/boingboomtschak/shelby">github link</a>
        </div>
        <p>A learning assessment tool which collects interaction data and survey data through a Chrome extension to categorize the efficacy and specific appeal of online learning resources. Intended for those with learning disabilities to find online resources that are easier to digest. Built as part of DubHacks 2019.</p>
    </div>
</div>

