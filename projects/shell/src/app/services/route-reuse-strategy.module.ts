/**
 * reuse-strategy.ts
 * by corbfon 1/6/17
 */

import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';
import { truncate } from 'fs';
import { environment } from '../environments/environment';
/** Interface for object which can store both:
 * An ActivatedRouteSnapshot, which is useful for determining whether or not you should attach a route (see this.shouldAttach)
 * A DetachedRouteHandle, which is offered up by this.retrieve, in the case that you do want to attach the stored route
 */
interface RouteStorageObject {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
}

export class CustomReuseStrategy implements RouteReuseStrategy {
  /**
   * Object which will store RouteStorageObjects indexed by keys
   * The keys will all be a path (as in url)
   * This allows us to see if we've got a route stored for the requested path
   */

  routeException = [];

  storedRoutes: { [key: string]: RouteStorageObject } = {};
  currentSystem = '';
  /**
   * Decides when the route should be stored
   * If the route should be stored, I believe the boolean is indicating to a controller whether or not to fire this.store
   * _When_ it is called though does not particularly matter, just know that this determines whether or not we store the route
   * An idea of what to do here: check the url to see if it is a path you would like to store
   * @param route This is, at least as I understand it, the route that the user is currently on, and we would like to know if we want to store it
   * @returns boolean indicating that we want to (true) or do not want to (false) store that route
   */

  clearStoredRoute(url) {
    delete this.storedRoutes[url];
  }

  clearAllStoredRoutes() {
    this.storedRoutes = {};
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const detach = false;

    const result = this.checkURLToSave(route);

    //  console.log('url: ', url);
    // console.log('detaching', route, 'return: ', detach);
    return result['AND'];
  }

  /**
   * Constructs object of type `RouteStorageObject` to store, and then stores it for later attachment
   * @param route This is stored for later comparison to requested routes, see `this.shouldAttach`
   * @param handle Later to be retrieved by this.retrieve, and offered up to whatever controller is using this class
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const storedRoute: RouteStorageObject = {
      snapshot: route,
      handle: handle
    };
    const url = storedRoute.snapshot['_routerState']['url'];
    console.log('currentURL: ', url);

    // console.log('store:', storedRoute, 'into: ', this.storedRoutes);
    // routes are stored by path - the key is the path name, and the handle is stored under it so that you can only ever have one object stored for a single path
    let enableMultiTab = false;
    // console.log('environment: ', environment);
    if ('enableMultiTab' in environment) {
      enableMultiTab = environment['enableMultiTab'];
    }

    if (enableMultiTab) {
      this.storedRoutes[url] = storedRoute;
    }
  }

  /**
   * Determines whether or not there is a stored route and, if there is, whether or not it should be rendered in place of requested route
   * @param route The route the user requested
   * @returns boolean indicating whether or not to render the stored route
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {

    // this will be true if the route has been stored before

    const result = this.checkURLToSave(route);
    // console.log('enableMultiTab shouldAttach: ', enableMultiTab);

    const canAttach: boolean = !!route.routeConfig && !!this.storedRoutes[result['url']] && result['AND'];

    // this decides whether the route already stored should be rendered in place of the requested route, and is the return value
    // at this point we already know that the paths match because the storedResults key is the url
    // so, if the route.params and route.queryParams also match, then we should reuse the component
    if (canAttach) {
      const willAttach = true;
      // console.log('param comparison:');
      // console.log(this.compareObjects(route.params, this.storedRoutes[url].snapshot.params));
      // console.log('query param comparison');
      // console.log(this.compareObjects(route.queryParams, this.storedRoutes[url].snapshot.queryParams));

      const paramsMatch: boolean = this.compareObjects(route.params, this.storedRoutes[result['url']].snapshot.params);
      const queryParamsMatch: boolean = this.compareObjects(route.queryParams, this.storedRoutes[result['url']].snapshot.queryParams);

      // console.log('deciding to attach...', route, 'does it match?', this.storedRoutes[url].snapshot, 'return: ', paramsMatch && queryParamsMatch);
      return paramsMatch && queryParamsMatch;
    } else {
      return false;
    }
  }

  /**
   * Finds the locally stored instance of the requested route, if it exists, and returns it
   * @param route New route the user has requested
   * @returns DetachedRouteHandle object which can be used to render the component
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {

    const result = this.checkURLToSave(route);

    // console.log('enableMultiTab retrieve: ', enableMultiTab);
    // return null if the path does not have a routerConfig OR if there is no stored route for that routerConfig
    if (!route.routeConfig || !this.storedRoutes[result['url']]) { return null; }
    if (result['NOR']) { return null; }
    // console.log('retrieving', 'return: ', this.storedRoutes[url]);

    /** returns handle when the url is already stored */
    return this.storedRoutes[result['url']].handle;
  }

  /**
   * Determines whether or not the current route should be reused
   * @param future The route the user is going to, as triggered by the router
   * @param curr The route the user is currently on
   * @returns boolean basically indicating true if the user intends to leave the current route
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // console.log('deciding to reuse', 'future', future.routeConfig, 'current', curr.routeConfig, 'return: ', future.routeConfig === curr.routeConfig);
    return future.routeConfig === curr.routeConfig;
  }

  /**
   * This nasty bugger finds out whether the objects are _traditionally_ equal to each other, like you might assume someone else would have put this function in vanilla JS already
   * One thing to note is that it uses coercive comparison (==) on properties which both objects have, not strict comparison (===)
   * Another important note is that the method only tells you if `compare` has all equal parameters to `base`, not the other way around
   * @param base The base object which you would like to compare another object to
   * @param compare The object to compare to base
   * @returns boolean indicating whether or not the objects have all the same properties and those properties are ==
   */
  private compareObjects(base: any, compare: any): boolean {

    // loop through all properties in base object
    for (const baseProperty in base) {

      // determine if comparrison object has that property, if not: return false
      if (compare.hasOwnProperty(baseProperty)) {
        switch (typeof base[baseProperty]) {
          // if one is object and other is not: return false
          // if they are both objects, recursively call this comparison function
          case 'object':
            if (typeof compare[baseProperty] !== 'object' || !this.compareObjects(base[baseProperty], compare[baseProperty])) { return false; } break;
          // if one is function and other is not: return false
          // if both are functions, compare function.toString() results
          case 'function':
            if (typeof compare[baseProperty] !== 'function' || base[baseProperty].toString() !== compare[baseProperty].toString()) { return false; } break;
          // otherwise, see if they are equal using coercive comparison
          default:
            if (base[baseProperty] != compare[baseProperty]) { return false; }
        }
      } else {
        return false;
      }
    }

    // returns true only after false HAS NOT BEEN returned through all loops
    return true;
  }

  checkURLToSave(route) {
    const url = route['_routerState']['url'];
    // console.log('url: ', url);
    const urlNotHome = url !== '/';

    const urlSplitRaw = url.split('/');
    const urlSplit = [];

    for (const eachSplit of urlSplitRaw) {
      if (eachSplit !== '') {
        urlSplit.push(eachSplit);
      }
    }

    if (urlSplit.length === 0) {
      this.currentSystem = '';
      this.storedRoutes = {};
    }

    if (urlSplit.length === 1) {
      if (this.currentSystem === '') {
        this.currentSystem = urlSplit[0];
      } else {
        if (this.currentSystem !== urlSplit[0]) {
          this.currentSystem = urlSplit[0];
          this.storedRoutes = {};
        }
      }
    }

    // console.log('urlSplit: ', urlSplit);
    let notFirstLevelURL = false;
    if (urlSplit.length > 1) {
      notFirstLevelURL = true;
    }

    let enableMultiTab = false;
    if ('enableMultiTab' in environment) {
      enableMultiTab = environment['enableMultiTab'];
    }

    return {
      url: url,
      urlNotHome: urlNotHome,
      notFirstLevelURL: notFirstLevelURL,
      enableMultiTab: enableMultiTab,
      AND: urlNotHome && notFirstLevelURL && enableMultiTab,
      NOR: !urlNotHome || !notFirstLevelURL || !enableMultiTab
    };
  }
}
