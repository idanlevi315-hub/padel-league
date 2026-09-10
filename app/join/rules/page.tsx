"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "en" | "es";

export default function RulesPage() {
  const [language, setLanguage] = useState<Language>("en");

  const isEnglish = language === "en";

  return (
    <main className="min-h-screen bg-[#eee9df] text-[#24372f]">
      <div className="mx-auto max-w-4xl px-5 pb-32 pt-7">
        <header className="flex items-center justify-between border-b border-[#24372f]/10 pb-5">
          <Link href="/" className="text-[34px] font-semibold tracking-[-0.06em] text-[#5f6b64]">18</Link>

          <Link
            href="/join"
            className="rounded-full bg-[#5f6b64] px-4 py-2 text-[10px] font-black tracking-[0.12em] text-white"
          >
            {isEnglish ? "REGISTER" : "INSCRIBIRSE"}
          </Link>
        </header>

        <section className="pb-10 pt-10 md:pb-12 md:pt-14">
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black tracking-[0.24em] text-[#7a847e]">
                {isEnglish ? "LEAGUE RULES" : "REGLAMENTO"}
              </p>

              <h1 className="mt-3 text-5xl font-black leading-[0.92] tracking-[-0.055em] sm:text-6xl md:text-7xl">
                {isEnglish ? (
                  <>
                    RULES &
                    <br />
                    FORMAT
                  </>
                ) : (
                  <>
                    REGLAS Y
                    <br />
                    FORMATO
                  </>
                )}
              </h1>
            </div>

            <div className="flex rounded-[16px] bg-white p-1.5 shadow-none">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-[12px] px-4 py-3 text-[10px] font-black tracking-[0.12em] transition ${
                  language === "en"
                    ? "bg-[#5f6b64] text-[#d9ef54]"
                    : "text-[#7a847e]"
                }`}
              >
                ENGLISH
              </button>

              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={`rounded-[12px] px-4 py-3 text-[10px] font-black tracking-[0.12em] transition ${
                  language === "es"
                    ? "bg-[#5f6b64] text-[#d9ef54]"
                    : "text-[#7a847e]"
                }`}
              >
                ESPAÑOL
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 overflow-hidden rounded-[14px] bg-[#5f6b64]">
          <QuickStat
            value="3"
            label={isEnglish ? "POINTS / WIN" : "PUNTOS / VICTORIA"}
          />

          <QuickStat
            value="2"
            label={isEnglish ? "GROUPS" : "GRUPOS"}
          />

          <QuickStat
            value="4"
            label={isEnglish ? "QUALIFY / GROUP" : "CLASIFICAN / GRUPO"}
          />
        </section>

        <section className="mt-10 rounded-[30px] bg-white px-5 shadow-none sm:px-8 md:px-10">
          {isEnglish ? <EnglishRules /> : <SpanishRules />}
        </section>

        <section className="mt-8 rounded-[16px] bg-[#d9ef54] p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div>
            <p className="text-[10px] font-black tracking-[0.2em] text-[#24372f]/50">
              {isEnglish ? "READY TO PLAY?" : "¿LISTO PARA JUGAR?"}
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
              {isEnglish
                ? "Register for the league"
                : "Inscríbete en la liga"}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#24372f]/65">
              {isEnglish
                ? "By registering, players confirm that they have read and accepted the league rules applicable to the current season."
                : "Al registrarse, los jugadores confirman que han leído y aceptado las reglas de la liga aplicables a la temporada actual."}
            </p>
          </div>

          <Link
            href="/join"
            className="mt-6 flex shrink-0 items-center justify-between gap-8 rounded-[16px] bg-[#5f6b64] px-5 py-4 text-xs font-black tracking-[0.1em] text-white md:mt-0"
          >
            <span>
              {isEnglish ? "REGISTER TEAM" : "INSCRIBIR 18"}
            </span>
            <span>→</span>
          </Link>
        </section>

        <footer className="mt-8 border-t border-[#24372f]/10 pt-5">
          <Link
            href="/"
            className="text-xs font-black tracking-[0.12em] text-[#7a847e]"
          >
            ← {isEnglish ? "BACK TO LEAGUE" : "VOLVER A LA LIGA"}
          </Link>
        </footer>
      </div>
    </main>
  );
}

function EnglishRules() {
  return (
    <>
      <RuleSection number="01" title="League Format">
        <p>
          The league is divided into two groups. Teams play a round-robin
          group stage, with every team playing every other team in its group.
        </p>

        <p>
          The top four teams from each group qualify for the championship
          playoffs.
        </p>
      </RuleSection>

      <RuleSection number="02" title="Weekly Matches">
        <p>
          Each pair of teams receives a full week to arrange and play its
          scheduled match.
        </p>

        <p>
          Players are responsible for coordinating the match between
          themselves and completing it within the relevant league week.
        </p>
      </RuleSection>

      <RuleSection number="03" title="Match Format">
        <p>Matches are played as best of three regular sets.</p>

        <p>
          A set is won at six games with a two-game advantage. At 6–6, a
          tie-break is played to seven points, with a two-point advantage.
        </p>

        <p>There is no match tie-break in place of the third set.</p>
      </RuleSection>

      <RuleSection number="04" title="Star Point">
        <p>At 40–40, normal advantage scoring applies.</p>

        <p>
          After the second return to deuce, the next point is the decisive
          Star Point.
        </p>

        <Highlight>
          Deuce → Advantage → Deuce → Advantage → Deuce → Star Point → Game
        </Highlight>
      </RuleSection>

      <RuleSection number="05" title="League Points">
        <p>A win is worth 3 league points. A loss is worth 0 points.</p>

        <p>
          A match that is not played by the deadline is recorded as{" "}
          <strong className="font-black text-[#24372f]">NOT PLAYED</strong>{" "}
          and gives 0 points to both teams.
        </p>

        <p>
          A NOT PLAYED match does not count as a win or loss and does not
          affect set or game difference.
        </p>
      </RuleSection>

      <RuleSection number="06" title="Standings">
        <p>Group standings are determined in the following order:</p>

        <div className="mt-5 overflow-hidden rounded-[18px] bg-[#eee9df]">
          <RankingRow number="1" text="Match wins" />
          <RankingRow number="2" text="Set difference" />
          <RankingRow number="3" text="Game difference" />
          <RankingRow number="4" text="Head-to-head result" />
        </div>
      </RuleSection>

      <RuleSection number="07" title="Result Submission">
        <p>One team submits the result after the match.</p>

        <p>
          The opposing team must confirm the result before it becomes
          official and is included in the standings.
        </p>

        <p>
          If the result is disputed, it is referred to the league
          administrator.
        </p>
      </RuleSection>

      <RuleSection number="08" title="Walkover">
        <p>
          If a confirmed match is arranged and one team fails to attend
          without reasonable prior notice, the attending team receives a
          technical win and 3 league points.
        </p>

        <p>
          No artificial 6–0, 6–0 score is added, so the walkover does not
          create a false set or game difference.
        </p>
      </RuleSection>

      <RuleSection number="09" title="Retirement">
        <p>
          If a team retires because of injury or another reason after a match
          has started, the opposing team receives the win and 3 points.
        </p>

        <p>
          Sets and games already completed remain recorded. No artificial
          games are added for the unplayed part of the match.
        </p>
      </RuleSection>

      <RuleSection number="10" title="Playoffs">
        <p>The quarterfinals are:</p>

        <PlayoffGrid />

        <p className="mt-5">
          The winners advance to the semifinals, followed by the championship
          final.
        </p>
      </RuleSection>

      <RuleSection number="11" title="Players & Partners">
        <p>
          A registered team consists of the same two players throughout the
          tournament.
        </p>

        <p>
          Partner substitutions are not permitted during the league or
          playoffs.
        </p>
      </RuleSection>

      <RuleSection number="12" title="Balls">
        <p>
          During the group stage, the four players involved in each match are
          responsible for providing suitable padel balls.
        </p>

        <p>
          For playoff matches, new balls are supplied by the league.
        </p>
      </RuleSection>

      <RuleSection number="13" title="Line Calls & Fair Play">
        <p>
          Matches are played without an umpire. The player closest to the ball
          makes the call.
        </p>

        <p>
          If there is genuine uncertainty and no clear agreement can be
          reached, the point is replayed.
        </p>

        <p>
          Respect, honesty and fair play are expected from all participants.
        </p>
      </RuleSection>
    </>
  );
}

function SpanishRules() {
  return (
    <>
      <RuleSection number="01" title="Formato de la Liga">
        <p>
          La liga se divide en dos grupos. Durante la fase de grupos, cada
          equipo juega contra todos los demás equipos de su grupo.
        </p>

        <p>
          Los cuatro primeros equipos de cada grupo se clasifican para los
          playoffs.
        </p>
      </RuleSection>

      <RuleSection number="02" title="Partidos Semanales">
        <p>
          Cada pareja de equipos dispone de una semana completa para organizar
          y jugar su partido programado.
        </p>

        <p>
          Los jugadores son responsables de coordinar entre ellos el día y la
          hora del partido dentro de la semana correspondiente.
        </p>
      </RuleSection>

      <RuleSection number="03" title="Formato del Partido">
        <p>Los partidos se juegan al mejor de tres sets normales.</p>

        <p>
          Un set se gana al llegar a seis juegos con una diferencia de dos. Con
          6–6 se juega un tie-break a siete puntos, con diferencia de dos.
        </p>

        <p>No se utiliza un match tie-break en sustitución del tercer set.</p>
      </RuleSection>

      <RuleSection number="04" title="Star Point">
        <p>Con 40–40 se aplica inicialmente el sistema normal de ventaja.</p>

        <p>
          Después del segundo regreso a iguales, el siguiente punto es el Star
          Point decisivo.
        </p>

        <Highlight>
          Iguales → Ventaja → Iguales → Ventaja → Iguales → Star Point → Juego
        </Highlight>
      </RuleSection>

      <RuleSection number="05" title="Puntuación de la Liga">
        <p>Una victoria otorga 3 puntos. Una derrota otorga 0 puntos.</p>

        <p>
          Si un partido no se juega antes de finalizar el plazo, se registra
          como{" "}
          <strong className="font-black text-[#24372f]">NOT PLAYED</strong>{" "}
          y ambos equipos reciben 0 puntos.
        </p>

        <p>
          El partido no cuenta como victoria ni derrota y no modifica la
          diferencia de sets o juegos.
        </p>
      </RuleSection>

      <RuleSection number="06" title="Clasificación">
        <p>
          La clasificación de cada grupo se determina en el siguiente orden:
        </p>

        <div className="mt-5 overflow-hidden rounded-[18px] bg-[#eee9df]">
          <RankingRow number="1" text="Victorias" />
          <RankingRow number="2" text="Diferencia de sets" />
          <RankingRow number="3" text="Diferencia de juegos" />
          <RankingRow
            number="4"
            text="Resultado del enfrentamiento directo"
          />
        </div>
      </RuleSection>

      <RuleSection number="07" title="Comunicación del Resultado">
        <p>
          Uno de los equipos introduce el resultado después del partido.
        </p>

        <p>
          El equipo rival debe confirmar el resultado antes de que sea oficial
          y se incluya en la clasificación.
        </p>

        <p>
          Si existe una disputa, el resultado será revisado por el
          administrador de la liga.
        </p>
      </RuleSection>

      <RuleSection number="08" title="Incomparecencia">
        <p>
          Si un partido estaba confirmado y un equipo no se presenta sin aviso
          previo razonable, el equipo presente recibe una victoria técnica y 3
          puntos.
        </p>

        <p>
          No se añadirá un resultado artificial de 6–0, 6–0, evitando así una
          diferencia ficticia de sets o juegos.
        </p>
      </RuleSection>

      <RuleSection number="09" title="Retirada">
        <p>
          Si un equipo se retira por lesión u otro motivo después de comenzar
          el partido, el equipo contrario obtiene la victoria y 3 puntos.
        </p>

        <p>
          Los sets y juegos ya disputados se mantienen. No se añaden juegos
          artificiales por la parte no jugada.
        </p>
      </RuleSection>

      <RuleSection number="10" title="Playoffs">
        <p>Los cuartos de final serán:</p>

        <PlayoffGrid />

        <p className="mt-5">
          Los ganadores avanzan a semifinales y posteriormente a la final.
        </p>
      </RuleSection>

      <RuleSection number="11" title="Jugadores y Parejas">
        <p>
          Un equipo está formado por los mismos dos jugadores durante toda la
          competición.
        </p>

        <p>
          No se permiten sustituciones de pareja durante la liga ni durante
          los playoffs.
        </p>
      </RuleSection>

      <RuleSection number="12" title="Pelotas">
        <p>
          Durante la fase de grupos, los cuatro jugadores participantes son
          responsables de aportar pelotas de pádel adecuadas.
        </p>

        <p>
          En los partidos de playoffs, la liga proporcionará pelotas nuevas.
        </p>
      </RuleSection>

      <RuleSection number="13" title="Decisiones de Línea y Juego Limpio">
        <p>
          Los partidos se disputan sin árbitro. El jugador más cercano a la
          pelota realiza la decisión.
        </p>

        <p>
          Si existe una duda real y no es posible alcanzar una decisión clara,
          el punto se repite.
        </p>

        <p>
          Se espera respeto, honestidad y juego limpio de todos los
          participantes.
        </p>
      </RuleSection>
    </>
  );
}

function RuleSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="grid grid-cols-[42px_1fr] border-t border-[#24372f]/10 py-8 first:border-t-0 sm:grid-cols-[70px_1fr] md:py-9">
      <div>
        <span className="text-[10px] font-black tracking-[0.1em] text-[#7a847e]">
          {number}
        </span>
      </div>

      <div>
        <h2 className="text-xl font-black tracking-[-0.03em] sm:text-2xl">
          {title}
        </h2>

        <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#7a847e]">
          {children}
        </div>
      </div>
    </article>
  );
}

function RankingRow({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-[#24372f]/8 px-4 py-3 last:border-b-0">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5f6b64] text-[10px] font-black text-[#d9ef54]">
        {number}
      </span>

      <span className="text-sm font-bold text-[#24372f]">
        {text}
      </span>
    </div>
  );
}

function QuickStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border-r border-white/10 px-4 py-5 last:border-r-0 sm:px-6">
      <p className="text-3xl font-black tracking-[-0.06em] text-[#d9ef54]">
        {value}
      </p>

      <p className="mt-1 text-[8px] font-black leading-4 tracking-[0.12em] text-white/40 sm:text-[9px]">
        {label}
      </p>
    </div>
  );
}

function Highlight({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 rounded-[16px] border-l-4 border-[#d9ef54] bg-[#5f6b64] px-4 py-4 text-sm font-black leading-7 text-white">
      {children}
    </div>
  );
}

function PlayoffGrid() {
  const matches = [
    ["A1", "B4"],
    ["B2", "A3"],
    ["A2", "B3"],
    ["B1", "A4"],
  ];

  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-2">
      {matches.map(([left, right]) => (
        <div
          key={`${left}-${right}`}
          className="flex items-center justify-between rounded-[14px] bg-[#eee9df] px-4 py-3"
        >
          <span className="font-black text-[#24372f]">
            {left}
          </span>

          <span className="text-[10px] font-black text-[#7a847e]">
            VS
          </span>

          <span className="font-black text-[#24372f]">
            {right}
          </span>
        </div>
      ))}
    </div>
  );
}