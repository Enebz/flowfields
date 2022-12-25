export class Vector3 {
  public x;
  public y;
  public z;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
  }

  setLength(len: number = 1) {
    this.normalize().multiply(len)
    return this;
  }

  add(other: Vector3 | number) {
    if (typeof(other) === 'number')
    {
      this.x += other;
      this.y += other;
      this.z += other;
      return this;
    }
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  subtract(other: Vector3 | number) {
    if (typeof(other) === 'number')
    {
      this.x -= other;
      this.y -= other;
      this.z -= other;
      return this;
    }
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  multiply(other: Vector3 | number) {
    if (typeof(other) === 'number')
    {
      this.x *= other;
      this.y *= other;
      this.z *= other;
      return this;
    }
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;
    return this;
  }

  divide(other: Vector3 | number) {
    if (typeof(other) === 'number')
    {
      if (other === 0) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this
      }
      this.x /= other;
      this.y /= other;
      this.z /= other;
      return this;
    }
    this.x /= other.x;
    this.y /= other.y;
    this.z /= other.z;
    return this;
  }

  normalize() {
    return this.divide(this.length());
  }

  headingXY() {
    if (this.y < 0) {
      return 2*Math.PI - Math.acos(this.x / new Vector3(this.x, this.y).length())
    }

    return Math.acos(this.x / new Vector3(this.x, this.y).length()) 
  }
  
  copy() {
    return new Vector3(this.x, this.y, this.z);
  }
}
