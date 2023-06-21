### Distraction Ward

This is a prototype for a **Chrome** extension meant to restrict access to certain websitesg the user deems **distracting**.

--- 

Feature Wishlist:

- the user may remove websites from a ban-list
- the user may turn the extension on/off
- the user may set certain time intervels within which the extension turns on/off

To do:
- create icon(s) for the extension [x]
- create pop-up menu for extension [x]
    - displays if current domain is blocked [x]
    - if not blocked => allows to block 
    [x]
    - if blocked => allows to unblock
    - option to get a list of blocked domains (as a json file)
    - on/off button
    - time interval to be turned on
- create worker that calls script when restricted domain is accessed 
[x]
- create script that does something to the page ( replaces it with a random quote + random emoji )
[x]
