// import {MiddlewareSequence} from '@loopback/rest';

import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  Send,
  SequenceActions,
  SequenceHandler
} from '@loopback/rest';
import {debug} from 'console';
import * as dotenv from 'dotenv';


dotenv.config();

// export class MySequence extends MiddlewareSequence {}


export class MySequence implements SequenceHandler {
  /**
   * Optional invoker for registered middleware in a chain.
   * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
   */
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

  /**
   * Constructor: Injects findRoute, invokeMethod & logError
   * methods as promises.
   *
   * @param findRoute - Finds the appropriate controller method,
   *  spec and args for invocation (injected via SequenceActions.FIND_ROUTE).
   * @param parseParams - The parameter parsing function (injected
   * via SequenceActions.PARSE_PARAMS).
   * @param invoke - Invokes the method specified by the route
   * (injected via SequenceActions.INVOKE_METHOD).
   * @param send - The action to merge the invoke result with the response
   * (injected via SequenceActions.SEND)
   * @param reject - The action to take if the invoke returns a rejected
   * promise result (injected via SequenceActions.REJECT).
   */
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
  ) { }

  /**
   * Runs the default sequence. Given a handler context (request and response),
   * running the sequence will produce a response or an error.
   *
   * Default sequence executes these steps
   *  - Executes middleware for CORS, OpenAPI spec endpoints
   *  - Finds the appropriate controller method, swagger spec
   *    and args for invocation
   *  - Parses HTTP request to get API argument list
   *  - Invokes the API which is defined in the Application Controller
   *  - Writes the result from API into the HTTP response
   *  - Error is caught and logged using 'logError' if any of the above steps
   *    in the sequence fails with an error.
   *
   * @param context - The request context: HTTP request and response objects,
   * per-request IoC container and more.
   */
  async handle(context: RequestContext): Promise<void> {

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');
    try {
      const {request, response} = context;
      // console.log("printing context: " + context);

      this.logStart(context);
      // console.log(request.headers);
      // console.log(allowedOrigins);



      // if (!request.headers.referer || !allowedOrigins?.includes(request.headers.referer)) {
      //   throw new Error('ERROR! The Specified Origin is not allowed.')
      // }



      // Invoke registered Express middleware
      const finished = await this.invokeMiddleware(context);
      if (finished) {
        // The response been produced by the middleware chain
        return;
      }
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);

      debug('%s result -', route.describe(), result);
      this.send(response, result);
    } catch (error) {
      this.LogError()
      this.reject(context, error);
    }
  }
  private logStart(context: RequestContext) {
    console.log('Start Time: ' + new Date().toLocaleTimeString())
    console.log('Referer: ' + context.request.headers.referer)
    console.log('User Agent: ' + context.request.headers['user-agent'])
    console.log('Request IP: ' + context.request.connection.remoteAddress)

  }

  private logComplete() {
    console.log('Completion Time: ' + new Date().toLocaleTimeString())
  }

  private LogError() {
    console.log('Log Error Time: ' + new Date().toLocaleTimeString())
  }

}//Class End



