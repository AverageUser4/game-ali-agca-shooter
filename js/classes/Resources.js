class Resources {
  resources = new Map();

  loadResource(src, name, type = 'image') {
    try {
      if(!src)
        throw new Error('No source provided for the resource.');
      if(!name)
        throw new Error('No name provided for the resource.');
      if(!type)
        throw new Error(`No valid type provided for the resource. Available types: 'audio', 'image'.`);
    } catch(error) {
      console.error(error);
    }

    let resource;

    if(type === 'image') {
      resource = new Image;
      resource.src = src;
    } else {
      resource = new Audio(src);
    }

    this.resources.set(name, resource);

    return resource;
  }

  getResource(name) {
    if(!this.resources.has(name))
      throw new Error(`No resource with given name '${name}' exists.`);

    return this.resources.get(name);
  }

  deleteResource(name) {
    this.resources.delete(name);
  }

  // maybe add createResourceGroup / deleteResourceGroup
}

export default new Resources();