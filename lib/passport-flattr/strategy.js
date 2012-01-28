/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

/**
 * `Strategy` constructor.
 *
 * The Flattr authentication strategy authenticates requests by delegating
 * to Flattr using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid. If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Flattr application's client id
 *   - `clientSecret`  your Flattr application's client secret
 *   - `callbackURL`   URL to which Flattr will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new FlattrStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/flattr/callback'
 *       },
 *       function(accessToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://flattr.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://flattr.com/oauth/token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'flattr';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Flickr.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `flattr`
 *   - `id`               the user's Flattr username
 *   - `displayName`      the user's full name
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.getProtectedResource('https://api.flattr.com/rest/v2/user', accessToken, function (err, body, res) {
    if (err) { return done(err); }

    try {
      o = JSON.parse(body);

      var profile = { provider: 'flattr' };
      profile.id = o.username;
      profile.displayName = o.firstname + ' ' + o.lastname;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
