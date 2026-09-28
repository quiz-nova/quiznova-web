export class URLCombiner {
  private parts: string[];
  constructor(...parts: string[]) {
    this.parts = parts;
  }

  /**
   * Combines the parts of this URLCombiner in to a single,
   * normalized URL
   *
   * e.g.  new URLCombiner('http:/foo.com/', '/bar', 'id', '5').toString()
   * returns: http://foo.com/bar/id/5
   */
  toString(): string {
    if (!this.parts || this.parts.length === 0) {
      return '';
    } else {
      let url = this.parts.join('/');

      // make sure protocol is followed by two slashes
      url = url.replace(/:\//g, '://');

      // remove consecutive slashes
      url = url.replace(/([^:\s])\/+/g, '$1/');

      // remove trailing slash
      url = url.replace(/\/($|\?|&|#[^!])/g, '$1');

      // replace ? in parameters with &
      url = url.replace(/(\?.+)\?/g, '$1&');

      return url;
    }
  }
}
