import { Injectable } from '@nestjs/common';
import * as Firebase from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin/app';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class FirebaseService {
  public readonly app: Firebase.app.App;

  constructor() {
    if (!this.app && Firebase.apps.length === 0) {
      const config = JSON.parse(process.env.FIREBASE_CONFIG);
      const credential = Firebase.credential.cert(config as ServiceAccount);
      this.app = Firebase.initializeApp({ credential });
    } else {
      this.app = Firebase.apps[0];
    }
  }

  async findOneByIdToken(idToken: string): Promise<UserRecord> {
    const rawToken = await this.app.auth().verifyIdToken(idToken);
    const firebaseUser = await this.app.auth().getUser(rawToken.uid);
    return firebaseUser;
  }

  async findOneByEmail(email: string): Promise<UserRecord | undefined> {
    const firebaseUser = await this.app.auth().getUserByEmail(email);
    return firebaseUser;
  }

  async create(email: string): Promise<UserRecord> {
    const firebaseUser = await this.app.auth().createUser({ email });
    return firebaseUser;
  }

  async removeByEmail(email: string): Promise<void> {
    const firebaseUser = await this.findOneByEmail(email);
    const uid = await firebaseUser.uid;
    await this.app.auth().deleteUser(uid);
  }

  async createUserIfNeeded(email: string): Promise<UserRecord> {
    try {
      const firebaseUser = await this.findOneByEmail(email);
      return firebaseUser;
    } catch (error) {
      if (error.code && error.code === 'auth/user-not-found') {
        const firebaseUser = await this.create(email);
        return firebaseUser;
      }
      throw error;
    }
  }

  async removeIfNeeded(email: string): Promise<void> {
    const firebaseUser = await this.findOneByEmail(email);
    if (firebaseUser) {
      return await this.removeByEmail(email);
    } else {
      return;
    }
  }
}
