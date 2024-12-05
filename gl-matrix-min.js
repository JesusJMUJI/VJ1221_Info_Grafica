(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.glMatrix = {}));
})(this, (function (exports) { 'use strict';

    // ...existing code...

    /**
     * 3 Dimensional Vector
     * @module vec3
     */
    var vec3 = {
        // ...existing methods...

        /**
         * Transforms the vec3 with a mat4.
         * 4th vector component is implicitly '1'
         *
         * @param {vec3} out the receiving vector
         * @param {ReadonlyVec3} a the vector to transform
         * @param {ReadonlyMat4} m matrix to transform with
         * @returns {vec3} out
         */
        transformMat4: function(out, a, m) {
            var x = a[0