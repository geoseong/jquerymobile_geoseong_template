
# geoseong's jQuery Mobile template

## LIBRARIES
- **jQueryMobile**
    - version : 1.4.5
- **CryptoJS**
    - version : 3.1.2

## CONTENTS
    -

## EVENTS
- $(document).ready(function(){})
- $(window).on('load', function(){});
- $(document).on('pagebeforeshow', function(){});
- $(window).on('navigate', function(){});
- $(document).keydown(function(){});
- window.addEventListener("beforeunload",function(){});

## CUSTOM VARIABLES
- ajax url collection (prod mode|| debug mode)

## CUSTOM FUNCTIONS
- ajax server connection  
    - have loading screen when request executed
- convert Date
    - input(`Thu May 31 2018 13:02:48 GMT+0900 (KST)`) -> output(`2018-05-31 13:02:48`)