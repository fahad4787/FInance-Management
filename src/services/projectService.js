import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const getAllProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (error) {
    console.error('Error loading projects:', error);
    throw error;
  }
};

export const saveProject = async (projectData) => {
  try {
    const dataWithTimestamp = {
      ...projectData,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'projects'), dataWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      ...projectData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
