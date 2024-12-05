  vec3 phong (vec3 N, vec3 L, vec3 V) {

    vec3  ambient  = Material.Ka * Light.La;
    vec3  diffuse  = vec3(0.0);
    vec3  specular = vec3(0.0);

    float NdotL    = dot (N,L);
    if (NdotL > 0.0) {
      vec3  R       = reflect(-L, N);;
      float RdotV_n = pow(max(0.0, dot(R,V)), Material.shininess);

      diffuse  = NdotL   * (Light.Ld * Material.Kd);
      specular = RdotV_n * (Light.Ls * Material.Ks);
    }
    return (ambient + diffuse + specular);
  }