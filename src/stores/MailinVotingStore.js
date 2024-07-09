
import { defineStore } from 'pinia';

export const useMailinVotingStore = defineStore("MailinVotingStore", {
  state: () => {
    return {
      votingSites: {},
      loadingMailinVotingData: true,
    };
  },
  actions: {
    async fillAllMailinVotingData() {
      this.fillVotingSites();
    },
    async clearAllMailinVotingData() {
      this.votingSites = {};
    },
    async fillVotingSites() {
      try {
        if (import.meta.env.VITE_DEBUG == 'true') console.log('findVotingSites is running');
        let baseUrl = 'https://phl.carto.com:443/api/v2/sql?q=';
        const url = baseUrl += `select * from voting_sites`
        const response = await fetch(url);
        if (response.ok) {
          this.votingSites = await response.json();
        } else {
          if (import.meta.env.VITE_DEBUG == 'true') console.warn('votingSites - await resolved but HTTP status was not successful');
        }
      } catch {
        if (import.meta.env.VITE_DEBUG == 'true') console.error('votingSites - await never resolved, failed to fetch address data');
      }
    },
  },
});