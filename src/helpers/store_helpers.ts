import { DatabaseManager } from '@subsquid/hydra-common';

export async function getOrCreate<T extends { id: string }>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string,
): Promise<T> {
  let e = await store.get(entityConstructor, {
    where: { id },
  });

  if (e == null) {
    e = new entityConstructor();
    e.id = id;
  }

  return e;
}

export async function getOrFail<T extends { id: string }>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string,
): Promise<T> {
  let e = await store.get(entityConstructor, {
    where: { id },
  });
  if (!e) {
    console.error('Not found when getting ', id);
    process.exit(0);
  }
  return e;
}

export async function get<T extends { id: string }>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string,
): Promise<T | undefined> {
  let e = await store.get(entityConstructor, {
    where: { id },
  });
  return e;
}

type EntityConstructor<T> = {
  new (...args: any[]): T;
};
