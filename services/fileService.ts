
export interface StoredFile {
    id: number;
    name: string;
    type: string; // MIME type
    size: number;
    category: string;
    date: string;
    data?: string; // Base64 string (optional if file is too big)
}

const STORAGE_KEY = 'yanns_local_files';
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB limit for localStorage safety

export const getStoredFiles = (): StoredFile[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading files", error);
        return [];
    }
};

export const saveFileToStorage = async (file: File, category: string): Promise<StoredFile> => {
    return new Promise((resolve, reject) => {
        // 1. Validation
        if (file.size > MAX_FILE_SIZE) {
            // We store metadata only for large files to prevent QuotaExceededError
            const newFile: StoredFile = {
                id: Date.now(),
                name: file.name,
                type: file.type,
                size: file.size,
                category,
                date: new Date().toISOString().split('T')[0],
                data: undefined // No data stored
            };
            addToStorage(newFile);
            resolve(newFile);
            return;
        }

        // 2. Conversion to Base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            try {
                const newFile: StoredFile = {
                    id: Date.now(),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    category,
                    date: new Date().toISOString().split('T')[0],
                    data: reader.result as string
                };
                addToStorage(newFile);
                resolve(newFile);
            } catch (e) {
                reject(new Error("Espace stockage navigateur plein. Supprimez des fichiers."));
            }
        };
        reader.onerror = () => reject(new Error("Erreur de lecture du fichier."));
    });
};

const addToStorage = (newFile: StoredFile) => {
    const files = getStoredFiles();
    const updatedFiles = [newFile, ...files];
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles));
    } catch (e) {
        throw new Error("Quota de stockage dépassé. Impossible de sauvegarder.");
    }
};

export const deleteFileFromStorage = (id: number) => {
    const files = getStoredFiles();
    const updatedFiles = files.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles));
    return updatedFiles;
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
