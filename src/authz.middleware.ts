import { Injectable, NestMiddleware } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as serviceAccount from '../service-account-key.json';
import { Request, Response } from 'express';

const firebase_key = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientX509CertUrl: serviceAccount.client_x509_cert_url,
};

@Injectable()
export class AuthzMiddleware implements NestMiddleware {
  defaultApp: firebase.app.App;

  constructor() {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_key),
    });
  }

  use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      this.defaultApp
        .auth()
        .verifyIdToken(token.replace('Bearer', '').trim())
        .then(async (decodedToken) => {
          const user = {
            email: decodedToken.email,
          };
          req['user'] = user;
        })
        .catch((err) => {
          console.error(err);
          this.accesDenied(req.url, res);
        });
    } else {
      next();
    }
  }

  private accesDenied(url: string, res: Response) {
    res.status(403).json({
      statuscode: 403,
      message: 'Access Denied',
    });
  }
}
