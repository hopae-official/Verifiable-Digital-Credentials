import { testApi } from '@/apis';
import { CredentialOffer } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTestQuery = () => {
  return useQuery({
    queryKey: ['test'],
    queryFn: () => testApi(),
  });
};



export const useCredentialOfferQuery = ({
  credentialOfferUri,
}: {
  credentialOfferUri: string;
}) => {
  return useQuery<CredentialOffer>({
    queryKey: ['credential-offer'],
    queryFn: async () => {
      const res = await axios.get(credentialOfferUri);
      return res.data;
    },
  });
};
