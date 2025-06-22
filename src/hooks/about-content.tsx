'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface AboutContent {
  id?: number;
  title: string;
  intro_paragraph: string;
  main_paragraph: string;
  conclusion_paragraph: string;
  closing_statement: string;
  created_at?: string;
  updated_at?: string;
}

const defaultContent: AboutContent = {
  title: 'About the MJIIT Research Portal',
  intro_paragraph: 'Welcome to the MJIIT Research Portal – a centralized platform designed exclusively for the researchers of the Malaysia-Japan International Institute of Technology (MJIIT). This portal serves as a dedicated space to support and streamline research-related activities across the institute.',
  main_paragraph: 'Our goal is to foster a collaborative and productive research environment by providing easy access to essential information, resources, and tools. The portal includes up-to-date announcements on research grants, templates for proposal submissions, and guidelines for research documentation. Researchers can also share their progress, update achievements, and stay informed on matters related to publications, consultancies, community engagement projects, and intellectual property.',
  conclusion_paragraph: 'Whether you\'re preparing a grant application, reporting research outcomes, or exploring collaborative opportunities, this platform aims to simplify and support your work. We are committed to making research at MJIIT more connected, transparent, and impactful.',
  closing_statement: 'Together, let\'s advance innovation and excellence in research at MJIIT.'
};

export function useAboutContent() {
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching about content from database...');
      const supabase = createClient();
      
      // Try to get all records first, then pick the first one
      const { data, error: fetchError } = await supabase
        .from('about_content')
        .select('*')
        .order('id', { ascending: true });

      console.log('Fetch result:', { data, fetchError });

      if (!fetchError && data && data.length > 0) {
        console.log('Setting content from database:', data[0]);
        setAboutContent(data[0]);
      } else {
        console.log('Using default content, error or no data:', fetchError);
        setAboutContent(defaultContent);
      }
    } catch (err) {
      console.error('Error fetching about content:', err);
      setError('Failed to load content');
      setAboutContent(defaultContent);
    } finally {
      setLoading(false);
    }
  };  const updateAboutContent = async (newContent: Partial<AboutContent>) => {
    try {
      setError(null);
      console.log('Updating about content:', newContent);
      
      const supabase = createClient();
      
      const updatedContent = {
        id: 1, // Always use ID 1 for the about content
        ...aboutContent,
        ...newContent,
        updated_at: new Date().toISOString(),
        created_at: aboutContent.created_at || new Date().toISOString()
      };

      console.log('Final content to save:', updatedContent);

      // Use upsert which will insert or update as needed
      const { error: upsertError, data: upsertData } = await supabase
        .from('about_content')
        .upsert([updatedContent])
        .select();

      console.log('Upsert result:', { upsertError, upsertData });

      if (upsertError) {
        throw upsertError;
      }
      
      if (upsertData && upsertData[0]) {
        setAboutContent(upsertData[0]);
        console.log('Content updated successfully in state');
      }

      console.log('Content updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating about content:', err);
      setError('Failed to save content');
      return false;
    }
  };

  useEffect(() => {
    void fetchAboutContent();
  }, []);

  return {
    aboutContent,
    loading,
    error,
    updateAboutContent,
    refetch: fetchAboutContent
  };
}
