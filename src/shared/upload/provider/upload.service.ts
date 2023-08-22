import { Injectable } from '@nestjs/common';
import { EasyCookBaseService } from '../../../shared/base/provider/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable()
export class UploadService {
    async upload(media: Express.Multer.File, collection: string): Promise<object> {
        const storage = getStorage();
        // Génère une chaîne de caractères représentant la date actuelle
        const currentDate = new Date().toISOString().replace(/:/g, '-');
        const storageRef = ref(storage, `${collection}/${currentDate}-${media.originalname}`);

        const snapshot = await uploadBytes(storageRef, media.buffer);

        const path = await getDownloadURL(snapshot.ref);
        const link = {
            url: path,
        };
        return link; // Renvoie le chemin du fichier dans le stockage
    }

    // async deleteFile(collection: string, path: string): Promise<void> {
    //     console.log(path);
    //     const storage = getStorage();
    //     const fileRef = ref(storage, `${collection}/${path}`);

    //     // Supprimer le fichier
    //     await deleteObject(fileRef);
    // }
}
