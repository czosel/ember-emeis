import Engine from "@ember/engine";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

import config from "ember-emeis/config/environment";

const { modulePrefix } = config;

export default class EmberEmeisEngine extends Engine {
  modulePrefix = modulePrefix;
  Resolver = Resolver;
}

loadInitializers(EmberEmeisEngine, modulePrefix);
