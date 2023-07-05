import { Fracture } from "./fracture";

/**
 * Buildoutput files based on the fracture configuration.
 *
 * @param fracture
 */
export const build = (fracture: Fracture) => {
  // some parts needed for the build process
  const { logger } = fracture;

  logger.info("=".repeat(80));
  logger.info("BUILD PHASE");
  logger.info("=".repeat(80));

  /*
  services.forEach((service) => {
    //service.build();
  });*/
  /*
  this.apps.forEach((app) => {
    app.build();
  });
  */
};
