---
layout: post
title: Principles of Computer Graphics
slug: principles-of-computer-graphics
---



The specification for this assignment was to create a basic 3D scene with mutliple objects, camera control, and various graphical effects under the title *Mars in Fiction*.

The scene had to be written in C++ and use OpenGL, and 'modern' OpenGL techniques that have been the standard since version 3, such as the use of vertex and fragment shaders, and vertex arrays.

#### Out of Date Documentation

This was by far the biggest issue I had while developing the scene. Our lectures were on the theory behind 2D and 3D graphics, covering algorithms, matrix mathematics, lighting models, and more. But we were given very little in the way of explained code samples, most of this we were expected to research ourselves.

The problem is that OpenGL changed significantly between versions 2 and 3, and becuase now the developer must deal with buffering data for the graphics hardware, and write code in the OpenGL Shading Language (GLSL), I think it has become considerably more difficult for beginners as so many new concepts need to be learnt for even the most basic applications.

Unfortunately when writing OpenGL applications, and googling for help on obscure error codes, much of the help is for version 2. This is often difficult, or impossible, to translate into the modern methods of using OpenGL.

There are some great resources for learning OpenGL, such as <a href="http://www.opengl-tutorial.org">opengl-tutorial.org</a>, but it's one of very few recent resources, so if you encounter problems, it can be very difficult to find more help.

#### Hardware Compatibility

The programming I've done in the past has rarely been tied so closely to the hardware. I wrote some code to run on an <a href="http://www.stm32circle.com/resources/stm32primer2.php">STM32 Primer2</a> last year, and that required being constantly aware of the hardware in the device and it's harsh limitations, but at least there was only one hardware standard across the several devices I used.

I spent a considerable amount of time working out the versions of OpenGL and GLSL that I was able to use on my computer, and that were available on the computer this would be marked on. Eventually I discovered after much trial and error, that I could use OpenGL 3.2 and GLSL 330 core. The process wasn't intuitive, and even finding out the version that I had on my computer was not easy with confliciting information online.

#### Application Architecture

One of the most difficult things I found about this assignment was not using new APIs that involved terminology I didn't understand, or learning C++ which I had no previous experience with. It was deciding how to structure the application at a high level.

When I write a web application in Python, I would generally use Django, which would tell me where to put my view code, where to put templates, how to write URL schemes, and so on. Cocoa applications on Mac OS have a fairly well defined structure as well. But when dealing with OpenGL, which isn't object oriented in any way, it can be difficult to work out where particular parts of the code should go.

Is it safe to buffer all the scene objects into graphics memory? Should objects be responsible for animating themselves? Do these variables need to be given to the shaders, and if so, how? These are all questions that seem quite daunting when writing the first few lines of code, because the structure may need to change significantly later on if one of them is wrong.

By the end of the assignment, I had ended up with a simple, but fairly capable mini framework for a lot of this. It's not perfect, but with a few hours to refactor some parts, and write code to dynamically load scenes and animations, it could be much better.

#### Conclusion

There is a need for a graphics *framework*. OpenGL provides a great API, but no hint about how an application should be structured. There are game engines out there that will do this, but I don't think the answer is to learn a game engine instead.

All that is really needed is a basic structure of probably no more than a dozen or so classes with basic scene object handling, shader setup, graphics pipeline and texturing. Possibly the most complex part that I think is desparately needed is handling for hardware compatibility – a way to abstract some of the main differences away from the graphics novice.

Most crucially though, the framework must be documented. Examples of how to show a textured cube, through to how to create a basic animated scene, would be very useful to many students and aspiring game developers.

Here's what my final scene looked like. It's very basic, but written to fulfil the assignment specification. I would have liked to spend more time making it nicer, perhaps with bump mapping, material loading, or smooth animation, but with exams coming in the next few weeks I unfortunately don't have enough time.

<iframe src="http://player.vimeo.com/video/56837082?byline=0&amp;portrait=0&amp;color=d60002" width="600" height="386" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

<br/>
