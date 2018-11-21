export default class Serializer {
  public serialize(obj: any): string {
    return JSON.stringify(obj);
  }

  public deserialize(string): any {
    return JSON.parse(string);
  }
}
