### the user auth state will be stored in a global context, and we will not server-render this info as there is no need for this, search engines in not going to look at this info, it is user-specific data, so we will use CSR (client-side-rendering) using react useEffect hook

### all of the authenticated routes will be client-side rendered as there is no need to server-render this kind of data, it not important to seo
