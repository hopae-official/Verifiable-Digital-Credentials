import { testApi } from '@/apis';
import { CredentialOffer } from '@/types';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
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

export const useTokenRequestMutation = (
  options?: UseMutationOptions<{ access_token: string }>,
) => {
  return useMutation({
    mutationFn: async () => {
      const res = await axios.post('https://issuer.dev.hopae.com/token', {
        // @Todo: Replace with actual data
        grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        pre_authorized_code: '8swr2odf8sd2ndokdg',
        tx_code: '1111',
      });

      return res.data;
    },
    ...options,
  });
};

type CredentialMutationRes = {
  credentials: Array<{ credential: string }>;
};

export const useCredentialRequestMutation = (
  options?: UseMutationOptions<
    CredentialMutationRes,
    unknown,
    { credentialType: string }
  >,
) => {
  return useMutation({
    mutationFn: async ({ credentialType }: { credentialType: string }) => {
      // Todo: Enhance token management
      const tokenRes = await axios.post('https://issuer.dev.hopae.com/token', {
        // @Todo: Replace with actual data
        grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        pre_authorized_code: '8swr2odf8sd2ndokdg',
        tx_code: '1111',
      });

      const token = tokenRes.data.access_token;

      const res = await axios.post(
        'https://issuer.dev.hopae.com/credential',
        {
          credential_identifier: credentialType,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return res.data;
    },
    ...options,
  });
};

export const useVerifyMetadataMutation = (options?: UseMutationOptions) => {
  return useMutation({
    mutationFn: async () => {
      const res = await axios.post('https://verifier.dev.hopae.com/request');

      return res.data;
    },
    ...options,
  });
};

export const useVerifyCredentialMutation = (
  options?: UseMutationOptions<
    string,
    unknown,
    { selectedCredential: string }
  > & {
    verifyRequestUri: string;
  },
) => {
  const verifyRequestUri = options?.verifyRequestUri;
  return useMutation({
    mutationFn: async ({
      selectedCredential,
    }: {
      selectedCredential: string;
    }) => {
      if (!verifyRequestUri) return;

      const res = await axios.post(verifyRequestUri);

      const responseUri = res.data.response_uri;
      console.log('responseUri: ', responseUri);

      const verifyRes = await axios.post(responseUri, {
        vp_token: selectedCredential,
      });

      console.log('verifyRes: ', verifyRes.data);

      return verifyRes.data;
    },
    ...options,
  });
};
