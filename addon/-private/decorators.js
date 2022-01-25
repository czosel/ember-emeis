import { assert } from "@ember/debug";

const catchErrors = (context, args, exception) => {
  const [
    {
      routeFor404,
      errorMessage = "emeis.general-error",
      notFoundErrorMessage = "emeis.not-found",
    } = {},
  ] = args;
  // Transition to route if 404 recieved and routeFor404 is set
  if (
    routeFor404 &&
    exception.isAdapterError &&
    exception.errors[0].status === "404"
  ) {
    context.notification.danger(this.intl.t(notFoundErrorMessage));
    context.replaceWith(routeFor404);
  } else {
    console.error(exception);
    if (
      !exception.errors ||
      !exception.errors.map((e) => e.detail).filter(Boolean).length
    ) {
      context.notification.danger(context.intl.t(errorMessage));
      return;
    }
    exception.errors?.forEach(({ detail }) => {
      context.notification.danger(detail);
    });
  }
};

const validate = (context) => {
  assert(
    "Inject the `notification` as well as the `intl` service into your route to properly display errors.",
    context.notification && context.intl
  );
};

export function handleModelErrors(...decoratorArgs) {
  const decorate = function (target, name, descriptor) {
    const originalDescriptor = descriptor.value;

    descriptor.value = function (...args) {
      validate(this);
      try {
        const result = originalDescriptor.apply(this, args);
        return result?.then
          ? result.catch((exception) =>
              catchErrors(this, decoratorArgs, exception)
            )
          : result;
      } catch (exception) {
        catchErrors(this, decoratorArgs, exception);
      }
    };
  };

  // We can assume that the decorator was called without options
  if (
    decoratorArgs.length === 3 &&
    !decoratorArgs[0].routeFor404 &&
    !decoratorArgs[0].errorMessage
  ) {
    return decorate(...decoratorArgs);
  }

  return decorate;
}

export function handleTaskErrors(...decoratorArgs) {
  return function (target, property, desc) {
    const gen = desc.value;

    desc.value = function* (...args) {
      validate(this);
      try {
        return yield* gen.apply(this, args);
      } catch (exception) {
        catchErrors(this, decoratorArgs, exception);
      }
    };

    return desc;
  };
}
