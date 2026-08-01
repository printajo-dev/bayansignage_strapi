import { useRef, useState, useCallback, useEffect } from 'react';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import {
  Field,
  Box,
  Flex,
  Typography,
  Button,
  TextInput,
  Grid,
  Modal,
  Loader,
  IconButton,
} from '@strapi/design-system';
import { Trash, Plus, Search } from '@strapi/icons';

type MediaFile = {
  id: number;
  name: string;
  url: string;
  mime: string;
  formats?: { thumbnail?: { url: string } };
};

type Props = {
  name: string;
  value?: string | null;
  onChange: (e: { target: { name: string; value: string; type: string } }) => void;
  intlLabel?: { defaultMessage?: string; id?: string };
  attribute?: { customField?: string };
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  error?: string;
  labelAction?: React.ReactNode;
};

// Absolute so it works regardless of how the admin panel resolves relative
// asset URLs; Strapi always returns file.url as a root-relative path
// (e.g. "/uploads/foo.jpg"), which the running Strapi instance itself serves.
function toAbsolute(url: string) {
  if (!url) return url;
  if (url.startsWith('http')) return url;
  return `${window.location.origin}${url}`;
}

export function ImagePickerInput({ name, value, onChange, intlLabel, required, disabled, hint, error }: Props) {
  const { get, post } = useFetchClient();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const label = intlLabel?.defaultMessage || name;

  const loadFiles = useCallback(
    async (search: string) => {
      setLoading(true);
      try {
        const res = await get('/upload/files', {
          params: {
            sort: 'createdAt:desc',
            pagination: { pageSize: 60 },
            filters: search ? { name: { $containsi: search } } : undefined,
          },
        });
        setFiles(res.data.results ?? res.data);
      } finally {
        setLoading(false);
      }
    },
    [get]
  );

  useEffect(() => {
    if (open) loadFiles(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => loadFiles(query), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const pick = (file: MediaFile) => {
    onChange({ target: { name, value: file.url, type: 'string' } });
    setOpen(false);
  };

  const clear = () => onChange({ target: { name, value: '', type: 'string' } });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', file);
      const res = await post('/upload', formData);
      const uploaded = res.data[0];
      onChange({ target: { name, value: uploaded.url, type: 'string' } });
      setOpen(false);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Field.Root name={name} error={error} hint={hint} required={required}>
      <Field.Label>{label}</Field.Label>
      <Box>
        {value ? (
          <Flex gap={3} alignItems="center" wrap="wrap">
            <Box
              tag="img"
              src={toAbsolute(value)}
              alt=""
              width="8rem"
              height="8rem"
              style={{ objectFit: 'cover', borderRadius: 4, border: '1px solid #dcdce4' }}
            />
            <Flex direction="column" gap={2} alignItems="flex-start">
              <Typography variant="pi" textColor="neutral600" style={{ wordBreak: 'break-all', maxWidth: 320 }}>
                {value}
              </Typography>
              <Flex gap={2}>
                <Button size="S" variant="secondary" onClick={() => setOpen(true)} disabled={disabled}>
                  Change image
                </Button>
                <IconButton label="Remove image" onClick={clear} disabled={disabled}>
                  <Trash />
                </IconButton>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Button variant="secondary" startIcon={<Plus />} onClick={() => setOpen(true)} disabled={disabled}>
            Select or upload image
          </Button>
        )}
      </Box>
      <Field.Hint />
      <Field.Error />

      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Select an image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Flex direction="column" gap={4} alignItems="stretch">
              <Flex gap={2}>
                <TextInput
                  placeholder="Search media library..."
                  startAction={<Search />}
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  aria-label="Search media library"
                />
                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  loading={uploading}
                  startIcon={<Plus />}
                >
                  Upload new
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                />
              </Flex>

              {loading ? (
                <Flex justifyContent="center" padding={6}>
                  <Loader>Loading media library...</Loader>
                </Flex>
              ) : files.length === 0 ? (
                <Box padding={6}>
                  <Typography textColor="neutral500">No images found.</Typography>
                </Box>
              ) : (
                <Grid.Root gap={3}>
                  {files
                    .filter((f) => f.mime?.startsWith('image/'))
                    .map((file) => (
                      <Grid.Item key={file.id} col={3} s={4}>
                        <button
                          type="button"
                          onClick={() => pick(file)}
                          style={{
                            width: '100%',
                            padding: 0,
                            border: '1px solid #dcdce4',
                            borderRadius: 4,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            background: 'none',
                          }}
                          title={file.name}
                        >
                          <img
                            src={toAbsolute(file.formats?.thumbnail?.url || file.url)}
                            alt={file.name}
                            style={{ width: '100%', height: '6rem', objectFit: 'cover', display: 'block' }}
                          />
                        </button>
                      </Grid.Item>
                    ))}
                </Grid.Root>
              )}
            </Flex>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button variant="tertiary">Cancel</Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </Field.Root>
  );
}

export default ImagePickerInput;
