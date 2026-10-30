import type {
  CreateResumeInput,
  Resume,
  UpdateResumeInput,
} from "../types/resume.types";

import type {
  ResumeRepository,
} from "./resume.repository";

const DB_NAME =
  "pulse";

const DB_VERSION = 1;

const STORE_NAME =
  "resumes";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise(
    (resolve, reject) => {
      const request =
        indexedDB.open(
          DB_NAME,
          DB_VERSION,
        );

      request.onupgradeneeded =
        () => {
          const database =
            request.result;

          if (
            !database
              .objectStoreNames
              .contains(
                STORE_NAME,
              )
          ) {
            const store =
              database.createObjectStore(
                STORE_NAME,
                {
                  keyPath: "id",
                },
              );

            store.createIndex(
              "userId",
              "userId",
              {
                unique: false,
              },
            );
          }
        };

      request.onsuccess =
        () => {
          resolve(
            request.result,
          );
        };

      request.onerror =
        () => {
          reject(
            request.error,
          );
        };
    },
  );
}

function requestToPromise<T>(
  request: IDBRequest<T>,
): Promise<T> {
  return new Promise(
    (resolve, reject) => {
      request.onsuccess =
        () => {
          resolve(
            request.result,
          );
        };

      request.onerror =
        () => {
          reject(
            request.error,
          );
        };
    },
  );
}

export class LocalResumeRepository
  implements ResumeRepository
{
  async getResume(
    id: string,
  ) {
    const database =
      await openDatabase();

    const transaction =
      database.transaction(
        STORE_NAME,
        "readonly",
      );

    const store =
      transaction.objectStore(
        STORE_NAME,
      );

    const resume =
      await requestToPromise<
        Resume | undefined
      >(
        store.get(id),
      );

    return resume ?? null;
  }

  async listResumes(
    userId: string,
  ) {
    const database =
      await openDatabase();

    const transaction =
      database.transaction(
        STORE_NAME,
        "readonly",
      );

    const store =
      transaction.objectStore(
        STORE_NAME,
      );

    const index =
      store.index("userId");

    const resumes =
      await requestToPromise<
        Resume[]
      >(
        index.getAll(userId),
      );

    return resumes.sort(
      (a, b) =>
        new Date(
          b.updatedAt,
        ).getTime() -
        new Date(
          a.updatedAt,
        ).getTime(),
    );
  }

  async createResume(
    data: CreateResumeInput,
  ) {
    const database =
      await openDatabase();

    const now =
      new Date().toISOString();

    const resume: Resume = {
      ...data,

      id: crypto.randomUUID(),

      createdAt: now,

      updatedAt: now,
    };

    const transaction =
      database.transaction(
        STORE_NAME,
        "readwrite",
      );

    const store =
      transaction.objectStore(
        STORE_NAME,
      );

    await requestToPromise(
      store.add(resume),
    );

    return resume;
  }

  async updateResume(
    id: string,
    data: UpdateResumeInput,
  ) {
    const existing =
      await this.getResume(id);

    if (!existing) {
      throw new Error(
        "Resume was not found.",
      );
    }

    const updated: Resume = {
      ...existing,
      ...data,

      personal:
        data.personal
          ? {
              ...existing.personal,
              ...data.personal,
            }
          : existing.personal,

      updatedAt:
        new Date().toISOString(),
    };

    const database =
      await openDatabase();

    const transaction =
      database.transaction(
        STORE_NAME,
        "readwrite",
      );

    const store =
      transaction.objectStore(
        STORE_NAME,
      );

    await requestToPromise(
      store.put(updated),
    );

    return updated;
  }

  async deleteResume(
    id: string,
  ) {
    const database =
      await openDatabase();

    const transaction =
      database.transaction(
        STORE_NAME,
        "readwrite",
      );

    const store =
      transaction.objectStore(
        STORE_NAME,
      );

    await requestToPromise(
      store.delete(id),
    );
  }
}