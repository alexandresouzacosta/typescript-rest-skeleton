export class BusinessError extends Error {
  constructor(message: string){
    super(message);
    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}

export class EntityNotFound extends Error {
  constructor(message: string){
    super(message);
    Object.setPrototypeOf(this, EntityNotFound.prototype);
  }
}

export class InvalidIdentifier extends Error {
  constructor(message: string){
    super(message);
    Object.setPrototypeOf(this, InvalidIdentifier.prototype);
  }  
}
