# OH_ -> Progressive Web App
Resources from Google on PWAs
[Service Workers - An Introduction](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)
[JavaScript Promises - An Introduction](https://developers.google.com/web/fundamentals/getting-started/primers/promises)


- Progressive:
  Should work perfectly across all browsers
- Responsive:
  Fits *ANY* aspect ratio
- Connectivity Independent:
  Should work with poor connectivity and when completely *offline*.
- App-like:
  Functionality is detatched from content (See the app-shell model).
- Fresh:
  Keeps all service workers up to date.
- Safe:
  Served via HTTPS: get your redirects in place!
- Discoverable:
  Has a W3C manifest and a service worker registration. (SEO)
- Re-engageable:
  Has persistent features like push notifs
- Installable:
  Is able to add to home screen without an app store.
- Linkable:
  Is easy to share via url.

### Want to know:
What is a service worker and how do I use one?
How do I make sure that my service workers are always up to date?
Is there any other SEO I should be aware of?
Is 'Installable' just tosh for chrome?

### Remember for life:
> As a human being, you're multithreaded. You can type with multiple fingers, you can drive and hold a conversation at the same time. The only blocking function we have to deal with is sneezing, where all current activity must be suspended for the duration of the sneeze. That's pretty annoying, especially when you're driving and trying to hold a conversation. You don't want to write code that's sneezy.

# What is a promise?
- A promise is a bit like an event listener, but can only succeed or fail.
- It can only succeed or fail once, and cannot switch between these.

The possible states of a promise:
- Fulfilled - *'succeeded'*
- Rejected - *'failed'*
- Pending - Has not succeeded or failed
- Settled - Has already succeeded or failed

The word *thenable* means promise-like, in that it has a `.then()` method.
