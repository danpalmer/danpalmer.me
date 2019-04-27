---
date: '2012-01-04'
layout: post
redirect_from:
- /2012/01/buffer-overflows
slug: buffer-overflows
title: Buffer Overflows
---

<p><small>This article was adapted from an assignment I completed for <a href="http://www.ecs.soton.ac.uk/admissions/ug/syllabus.php?unit=COMP2040">Secure Systems (COMP2040)</a> as a part of my <a href="http://www.ecs.soton.ac.uk/admissions/ug/G421.php">Computer Science with Mobile and Secure Systems</a> degree at the <a href="http://www.ecs.soton.ac.uk/">University of Southampton</a>.</small></p>
- - -

The task given to me was to create a webserver that was exploitable with buffer overflow. This was my first attempt at networking code in C so it may be quite a bad implementation, I was also quite rushed with this coursework due to approaching exams. The server binds to port 8000 and delivers files from the directory it is run from. It will only handle 1 request at a time and it only supports GET requests, but it features basic protection against directory traversal attacks.

<script src="https://gist.github.com/4287012.js"></script>

This code handles a request by first reading in all of the data it can. A better implementation would read in a loop until it sees two CLRFs or <code>\n\n</code> which indicates the end of the HTTP request. This implementation reads in 8096 bytes.

After it has the string of data, it checks in is a GET request by comparing the first 4 characters to '<code>GET </code>'. The <code>strip_string_traversal()</code> function then copies the safe part of the requested URL into another buffer. The second buffer is only 255 characters long (a poor assumption based on Unix filename limits) and there is no checking on the bounds on this copy. This exposes a buffer overflow.

There are 3 main defences that had to be circumvented in order to exploit this code.

1. **Stack canaries** or stack protectors are additional values put into the code by the compiler very close in memory to the return address pointer that needs to be overwritten.
2. **Address Space Layout Randomisation** is a feature of most current OSes that changes the address space of applications and libraries each time they are loaded.
3. **Disabling Stack Execution** means that instructions on the stack will not be executed.

<small>[https://wiki.ubuntu.com/Security/Features](https://wiki.ubuntu.com/Security/Features)</small>

##### Stack Protectors

These are a relatively new feature of compilers and OSes. They introduce a non-trivial performance overhead so will probably not be widely introduced on older hardware which means they are often not present on systems that may be attacked. The OS I tested my exploit on was Ubuntu 11.10, the latest at the time of this lab report. Because of this I had to disable stack protectors which are on by default in <code>gcc</code> under this version of the OS. To disable the stack protectors I included the option <code>-fno-stack-protector</code> when compiling.

##### Address Space Layout Randomisation

For the purposes of testing my code I disabled ASLR, however on 32-bit systems it is relatively easy to work out by 'brute force' where the code you need is located as there are only 16 bits of randomisation. In a scattergun approach simply trying the same place in memory will exploit some systems if a large enough number of systems are attempted. On 64-bit systems this is a lot more difficult to do. <br/><small>http://en.wikipedia.org/wiki/Address_space_layout_randomization</small>

##### Stack Execution

It is now common to disable execution of code from the stack. This can be circumvented with 'return to libc' attacks which make calls to libc functions like <code>system()</code> and place arguments on the stack in front of the return address to make it look like a function call. This can be very effective, but for my attack I re-enabled stack execution on the server binary using the program <code>execstack</code> and by running this as part of the compilation with <code>-z execstack</code>.

#### Exploit

<script src="https://gist.github.com/4287063.js"></script>
<small><a href="http://www.blackhatacademy.org/security101/index.php?title=Buffer_Overflows">http://www.blackhatacademy.org/security101/index.php?title=Buffer_Overflows</a></small>
<p>
	<dl>
		<dt>buffer_addr</dt>
		<dd>The address, in little-endian format, that we want to return to for our exploit to execute.</dd>
		<dt>payload</dt>
		<dd>The shellcode to execute, this payload will output the phrase "hacked!" to stdout.</dd>
		<dt>padding</dt>
		<dd>In order for the return address to be seen correctly and the exploit to work, it must be correctly aligned in memory and depending on the size of the payload, this padding may need to change. It can be found by running the exploit and inspecting the memory of the server around the stack pointer, shortly after the overflow has been caused, with the command <code>(gdb) x/200x $esp</code></dd>
	</dl>
</p>

The exploit sends 100 'nop' instructions (0x90 in shellcode) to create a 'nop-slide', although as we can be specific about the return address far fewer are actually needed. It then sends the payload code we want to execute, and finally it writes a large number of copies of the return address to the nop-slide with the specified padding to ensure it's located properly.