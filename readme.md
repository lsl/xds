##Cross Domain Storage (xds)

Currently just a POC inspired by a [blog post](http://www.nczonline.net/blog/2010/09/07/learning-from-xauth-cross-domain-localstorage/) about [xauth](https://github.com/xauth/)

Almost a complete copy of Zakas' code, but with whitelisting removed as I need to get around cross-origin for another project.

###Test it out

```
git clone git@github.com:lsl/xds.git

cd xds

npm install

node example.js
```

View http://localhost:3000/ in your browser, inspect and view console for output of it working.

Essentially, this allows you to have client site A and client site B (serving/using xds.js) able to access the local storage shared at server site X (hosting xds-serve.html and xds-serve.js)

If you want to use this for two client sites you control, and keep any other domains from accessing the storage, you really need whitelisting added IF you need that, bug my issue list, or send me a pull request. You can also view Zakas' original blog post if you want an example of how to do it.

###Note
Whitelisting is **removed**, this allows the bad guys to change values in settings you're setting in the users localstorage!.. then again if you're interested in this you probably already know that.

##todo
* whitelisting
* refactor
* needs real unittests
* maybe add it to components?