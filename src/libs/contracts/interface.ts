export type TApiRespGood<T> = {
    good: true;
    response?: T;
    count?: number;
};

export type TApiRespBad = {
    good: false;
    errorMessage: string;
    errorCode: number;
    extra?: Record<string, unknown> | null;
};

export type TApiResp<T> = TApiRespGood<T> | TApiRespBad;
