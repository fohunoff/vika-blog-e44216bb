import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Хук для безопасного вызова API с возможностью отмены запроса
 *
 * @param apiFn Функция API, которую нужно вызвать
 * @param defaultValue Значение по умолчанию, если запрос отменяется или не удаётся
 * @param timeout Таймаут в миллисекундах (по умолчанию 5000)
 */
export function useSafeApiCall<T, Args extends any[]>(
    apiFn: (...args: Args) => Promise<T>,
    defaultValue: T,
    timeout: number = 5000
) {
    const [data, setData] = useState<T>(defaultValue);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const abortController = useRef<AbortController | null>(null);

    // Очистка предыдущего контроллера
    const cleanupController = useCallback(() => {
        if (abortController.current) {
            abortController.current.abort();
            abortController.current = null;
        }
    }, []);

    // Вызов API функции с возможностью отмены
    const callApi = useCallback(async (...args: Args) => {
        // Очистка предыдущего контроллера
        cleanupController();

        // Создание нового контроллера
        abortController.current = new AbortController();

        setIsLoading(true);
        setError(null);

        // Установка таймаута
        const timeoutId = setTimeout(() => {
            if (abortController.current) {
                abortController.current.abort();
                console.warn('API call timed out');
            }
        }, timeout);

        try {
            // Передача signal в API функцию, если она это поддерживает
            const result = await apiFn(...args);

            // Проверка, не был ли запрос отменен
            if (abortController.current?.signal.aborted) {
                return defaultValue;
            }

            setData(result);
            return result;
        } catch (err) {
            // Проверка, не был ли запрос отменен
            if (err instanceof DOMException && err.name === 'AbortError') {
                console.log('API call was aborted');
                return defaultValue;
            }

            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            console.error('API call failed:', error);
            return defaultValue;
        } finally {
            clearTimeout(timeoutId);
            setIsLoading(false);
        }
    }, [apiFn, cleanupController, defaultValue, timeout]);

    // Очистка при размонтировании
    useEffect(() => {
        return cleanupController;
    }, [cleanupController]);

    return { data, isLoading, error, callApi };
}

export default useSafeApiCall;
