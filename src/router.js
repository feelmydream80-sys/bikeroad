class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.onRouteChange = null;

    window.addEventListener('hashchange', () => this._handleRoute());
    window.addEventListener('load', () => this._handleRoute());
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    window.location.hash = path;
  }

  _handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this._matchRoute(hash);

    if (this.currentRoute && this.currentRoute.onLeave) {
      this.currentRoute.onLeave();
    }

    this.currentRoute = route;

    if (route && route.handler) {
      route.handler();
    }

    if (this.onRouteChange) {
      this.onRouteChange(route);
    }

    this._updateActiveNav();
  }

  _matchRoute(path) {
    const route = this.routes[path];
    if (route) {
      return { path, handler: route };
    }

    for (const [pattern, handler] of Object.entries(this.routes)) {
      const paramNames = [];
      const regex = this._pathToRegex(pattern, paramNames);

      if (regex.test(path)) {
        const matches = path.match(regex);
        const params = {};
        paramNames.forEach((name, i) => {
          params[name] = matches[i + 1];
        });
        return {
          path,
          handler: () => handler(params),
          params
        };
      }
    }

    return null;
  }

  _pathToRegex(pattern, paramNames) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const namedParam = /(\/:([^\/]+))/g;
    let regexStr = escaped.replace(namedParam, (_, __, name) => {
      paramNames.push(name);
      return '/([^/]+)';
    });

    return new RegExp(`^${regexStr}$`);
  }

  _updateActiveNav() {
    const hash = window.location.hash.slice(1) || '/';
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href === `#${hash}` || (hash === '/' && href === '#/')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

export const router = new Router();