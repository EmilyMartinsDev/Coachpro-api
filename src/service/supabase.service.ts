import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
interface UploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export const uploadFileToSupabase = async (
  file: UploadFile,
  bucket: 'planos-treino' | 'planos-alimentares' | 'comprovantes' | 'fotos-feedback' | 'fotos-anamnese'
): Promise<string> => {
  const fileExt = file.originalname.split('.').pop() || 
                 (file.mimetype.includes('jpeg') ? 'jpg' : 
                  file.mimetype.includes('png') ? 'png' : 'bin');
  const fileName = `${uuidv4()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Erro ao fazer upload: ${error.message}`);
  }

  return supabase.storage
    .from(bucket)
    .getPublicUrl(data.path).data.publicUrl;
};

export const deleteFileFromSupabase = async (
  url: string,
  bucket: 'planos-treino' | 'planos-alimentares' | 'comprovantes' | 'fotos-feedback'
) => {
  const fileName = url.split('/').pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName]);

  if (error) {
    console.error(`Erro ao deletar arquivo: ${error.message}`);
  }
};