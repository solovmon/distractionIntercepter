### Distraction Ward

This is a prototype for a **Chrome** extension meant to restrict access to certain websitesg the user deems **distracting**.

--- 

Feature Wishlist:
- prevents the user from visiting certain websites
- the user may add or remove websites to/from a ban-list
- the user may turn the extension on/off
- the user may set certain time intervels within which the extension turns on/off
- the extension replaces the distraction with a corny motivation quote

To do:
- create icon(s) for the extension [X]
- create pop-up menu for extension 
    - displays if current domain is blocked 
    - if not blocked => allows to block
    - if blocked => allows to unblock
    - option to get a list of blocked domains (as a json file)
    - on/off button
    - time interval to be turned on
- create worker that calls script when restricted domain is accessed
- create script that does something to the page ( replaces it with a random quote + random emoji )
