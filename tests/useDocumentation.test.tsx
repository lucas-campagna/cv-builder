import { render, waitFor } from '@testing-library/react';
import { useDocumentation } from '../src/hooks/useDocumentation';

// Mock fetch
global.fetch = jest.fn();

describe('useDocumentation', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('should load documentation successfully', async () => {
    const mockContent = '# Test Documentation\nThis is test content';
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockContent),
    });

    let result: ReturnType<typeof useDocumentation>;
    function TestComponent() {
      result = useDocumentation('test.md');
      return null;
    }

    render(<TestComponent />);

    await waitFor(() => {
      expect(result!.content).toBe(mockContent);
      expect(result!.loading).toBe(false);
      expect(result!.error).toBe(null);
    });
  });

  test('should handle fetch error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    let result: ReturnType<typeof useDocumentation>;
    function TestComponent() {
      result = useDocumentation('test.md');
      return null;
    }

    render(<TestComponent />);

    await waitFor(() => {
      expect(result!.content).toBe('');
      expect(result!.loading).toBe(false);
      expect(result!.error).toBe('Failed to load test.md');
    });
  });
});