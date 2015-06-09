bundle-server
=============

A reference implementation of the bundle server API

Support will be added to devkit in the future for loading applications from HTTP
servers following this specification. The spec does not currently cover DLC
which may be investigated later this year.

[![Circle CI](https://circleci.com/gh/gameclosure/bundle-server/tree/master.svg?style=svg&circle-token=a07450db8207856d1b35a94ae027b6986cf7671f)](https://circleci.com/gh/gameclosure/bundle-server/tree/master)
## Synopsis

Enable loading JavaScript, Images, Sounds, and other resources remotely instead
of packaging them with `.apk` and `.ipa` builds.

### Bundle Service

Devkit will support remote loading via a set of HTTP endpoints. The endpoints
should be mountable either at a website root or nested under other resources.
`<base>` in the following endpoints is an arbitrary base URL.

The functionality we need to achieve is getting a list of available apps,
loading the latest bundle for a particular app, loading a particular version of
a bundle for an app, and receiving incremental changes for real time editing of
an app.

#### List applications

Request

```http
GET /<base>/apps
```

Return a list of available devkit applications

```js
[
  {
    "id": "UUID-123",
    "name": "Doki Stars"
    "desc": "Fast paced match-2 game",
    "icon": "relative/path/icon.png",
    "splash": "relative/path/splash.png"
  },
  {
    "id": "UUID-456",
    "name": "Hamster Hop",
    "desc": "A very hoppy hamster",
    "icon": "relative/path/icon.png",
    "splash": "relative/path/splash.png"
  }
]
```

The relative paths in the `icon` and `splash` properties can be coupled with the
file loading api to form an HTTP resource.

#### Get application info

##### Request

```http
GET /<base>/:app_id
```

`:app_id` should be an `id` returned from `GET /<base>/apps`.

##### Response

```js
{
  "id": "UUID-123",
  "name": "Doki Stars",
  "desc": "Fast paced match-2 game",
  "icon": "relative/path/icon.png",
  "splash": "relative/path/splash.png",
  "versions": [
    { "version": "v1.0.1" },
    { "version": "v1.0.2" }
  ]
}
```

Version identifiers need not be semantic. They could be git revisions or some
other arbitrary identifier.

#### Get latest bundle

##### Request

```http
GET /<base>/:app_id/bundle/latest
```

##### Response

Returns a zip archive of the latest bundle for `:app_id`.

#### Get bundle by version

##### Request

```http
GET /<base>/:app_id/bundle/:version
```

##### Response

Returns a zip archive of bundle version `:version` for `:app_id`.

#### Listen for changes

##### Request

```http
GET /<base>/:app_id/watch
```

The endpoint can optionally be upgraded to a WebSocket channel. Long polling is
the default operation mode for the endpoint.

##### Response

A JSON payload will be returned indicating the files that were added, modified,
or removed. Actions that did not occur in this change set will not be included
as keys in the response. For example, if no files were removed, the response
object would just have `added` and `modified`.

```js
{
   "added": [
     { "path": "relative/app/path/file0" }
   ],
   "modified": [
     { "path": "relative/app/path/file1" },
     { "path": "relative/app/path/file2" }
   ],
   "removed": [
     { "path": "relative/app/path/file3" }
   ]
}
```

#### Get file by path

The watch API is complemented by this file loading API. It could additionally be
used to load an entire bundle if we had an endpoint that returned a manifest for
an application.

##### Request

```http
GET /<base>/:app_id/file/:version/:path
```

`:version` may have the special value of `latest` to grab the latest version.

##### Response

The requested file. The `Content-Type` header will be set according to the file
extension.
